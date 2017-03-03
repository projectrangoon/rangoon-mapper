import Heap from 'heap';
import _ from 'lodash';

export const createConstants = (...constants) =>
  constants.reduce((acc, constant) => (
    Object.assign({}, acc, {
      [constant]: constant,
    })
  ), {});

export const isEnglish = (text) => {
  const engRegex = /^[A-Za-z0-9 ]*$/;
  return engRegex.test(text);
};

export const searchBusStops = (allStops, searchString) =>
_.filter(allStops, (stop) => {
  const pattern = new RegExp(`(?:^|\\s+|/|,s)${searchString}`, 'i');
  if (isEnglish(searchString)) {
    return pattern.test(stop.name_en);
  }
  return pattern.test(stop.name_mm);
});

export const stripDistance = busStops => busStops.map(x => _.omit(x, 'distance'));

export const getUniqueId = (busStop, serviceName) => {
  const busStopId = _.padStart(busStop.bus_stop_id.toString(), 5, 'Z');
  const sn = _.padStart(serviceName.toString(), 2, 'B');
  return `${busStopId}${sn}`;
};

export const getEngNames = busStops => busStops.map(x => _.pick(x, 'name_en'));

export const getNames = busStops => busStops.map(x => _.pick(x, 'name_en', 'sequence', 'route'));

export const toRadians = degrees => degrees * (Math.PI / 180);

export const getDistance = (lat1Deg, lng1Deg, lat2Deg, lng2Deg) => {
  const lat1 = toRadians(lat1Deg);
  const lng1 = toRadians(lng1Deg);
  const lat2 = toRadians(lat2Deg);
  const lng2 = toRadians(lng2Deg);
  const dlon = lng2 - lng1;
  const dlat = lat2 - lat1;
  const a = (Math.sin(dlat / 2) ** 2) + (Math.cos(lat1) * Math.cos(lat2) *
                                         (Math.sin(dlon / 2) ** 2));
  const c = 2 * Math.asin(Math.sqrt(a));
  return 6367 * c;
};

export const flatternServices = (busStop, stop) => {
  const result = [];
  const s = {
    lng: busStop.lng,
    lat: busStop.lat,
    name_en: busStop.name_en,
    name_mm: busStop.name_mm,
    road_mm: busStop.road_mm,
    road_en: busStop.road_en,
    bus_stop_id: busStop.bus_stop_id,
    township_en: busStop.township_en,
    township_mm: busStop.township_mm,
  };
  if (stop) {
    s.distance = getDistance(busStop.lat, busStop.lng, stop.lat, stop.lng);
  }
  busStop.services.forEach((service) => {
    result.push(Object.assign({}, s, {
      service_name: service.service_name,
      color: service.color,
      sequence: service.sequence,
    }));
  });
  return result;
};

export const getNearbyStops = (busStopsMap, stop, radius = 0.5) => {
  if (!stop.lat) {
    // eslint-disable-next-line no-param-reassign
    stop = _.filter(busStopsMap, x => x.bus_stop_id === stop.bus_stop_id)[0];
  }
  const deltaLat = radius / 110.567;
  const maximalLat = stop.lat + deltaLat;
  const minimalLat = stop.lat - deltaLat;

  const maxDeltaLng = Math.cos(maximalLat) * (radius / 111.321);
  const minDeltaLng = Math.cos(minimalLat) * (radius / 111.321);
  const maximalLng = stop.lng - maxDeltaLng;
  const minimalLng = stop.lng + minDeltaLng;
  const stops = _.filter(busStopsMap, x => (x.lat !== stop.lat) && (x.lng !== stop.lng) &&
                  (minimalLat < x.lat) && (x.lat < maximalLat) &&
                  (minimalLng < x.lng) && (x.lng < maximalLng));
  const result = [];
  stops.forEach((busStop) => {
    const s = {
      lng: busStop.lng,
      lat: busStop.lat,
      name_en: busStop.name_en,
      name_mm: busStop.name_mm,
      township_en: busStop.township_en,
      township_mm: busStop.township_mm,
      bus_stop_id: busStop.bus_stop_id,
      road_mm: busStop.road_mm,
      road_en: busStop.road_en,
      distance: getDistance(stop.lat, stop.lng, busStop.lat, busStop.lng),
    };
    busStop.services.forEach((service) => {
      result.push(Object.assign({}, s, {
        service_name: service.service_name,
        color: service.color,
        sequence: service.sequence,
      }));
    });
  });
  return result;
};

export const getStopsObjects = (busStopsMap, routePath) => {
  const z = {
    ...routePath,
    path: _.map(routePath.path, (busStop) => {
      const x = busStopsMap[busStop.bus_stop_id];
      x.service_name = busStop.service_name;
      x.walk = busStop.walk || undefined;
      x.distance = busStop.distance || undefined;
      if (x.service_name === 0) {
        x.color = '#ffffff';
      } else {
        x.color = x.services.filter(y => x.service_name === y.service_name)[0].color;
      }
      return x;
    }),
  };

  if (z.currTransfers > 0) {
    const finalPath = [z.path[0]];
    for (let i = 1; i < z.path.length; i++) {
      if (z.path[i].service_name !== z.path[i - 1].service_name) {
        const last = {
          ...z.path[i],
          service_name: z.path[i - 1].service_name,
          color: z.path[i - 1].color,
        };
        finalPath.push(last);
      }
      finalPath.push(z.path[i]);
    }
    return { ...z, path: finalPath };
  }

  return z;
};

export const calculateRoute = (graph, busStopsMap, startStop, endStop,
                               walkingDistance = 0.75, perStopCost = 0.35,
                               perTransferCost = 10, walkingCost = 7.5) => {
  const seen = new Set();
  const queue = new Heap((a, b) => (a.currCost - b.currCost) || (a.currDistance - b.currDistance));

  queue.push({
    currCost: 0,
    currDistance: 0,
    currTransfers: 0,
    path: [{
      bus_stop_id: startStop.bus_stop_id,
      service_name: 0,
      distance: 0,
    }],
  });


  const nearbyStops = getNearbyStops(busStopsMap, startStop, walkingDistance);
  nearbyStops.map(stop => queue.push({
    currCost: stop.distance * walkingCost,
    currDistance: 0,
    currTransfers: 0,
    path: [{
      bus_stop_id: stop.bus_stop_id,
      service_name: 0,
      walk: true,
      distance: stop.distance,
    }],
  }));

  while (queue.size()) {
    const top = queue.pop();
    const lastKnownStop = top.path[top.path.length - 1];
    const lastKnownServiceName = lastKnownStop.service_name;
    if (lastKnownStop.bus_stop_id === endStop.bus_stop_id) {
      const result = {
        ...top,
        currTransfers: top.currTransfers > 0 ? top.currTransfers - 1 : 0,
      };

      if (result.path.length >= 2) {
        result.path[0].service_name = result.path[1].service_name;
      }
      return new Promise((resolve, reject) => {
        if (result.path.length) {
          resolve(getStopsObjects(busStopsMap, result));
        } else {
          reject({ error: 'Unable to calculate any route.' });
        }
      });
    }

    const nearbyLastKnownStops = getNearbyStops(busStopsMap, lastKnownStop, walkingDistance);
    const found = _.find(nearbyLastKnownStops, { bus_stop_id: endStop.bus_stop_id });
    if (found) {
      const result = {
        ...top,
        currTransfers: top.currTransfers > 0 ? top.currTransfers - 1 : 0,
      };
      result.path[result.path.length - 1].walk = true;
      // TODO: shouldn't override the cumulative distance with walking distance
      result.path[result.path.length - 1].distance = found.distance;
      if (result.path.length >= 2) {
        result.path[0].service_name = result.path[1].service_name;
      }
      return new Promise((resolve, reject) => {
        if (result.path.length) {
          resolve(getStopsObjects(busStopsMap, result));
        } else {
          reject({ error: 'Unable to calculate any route.' });
        }
      });
    }

    const lastStopId = getUniqueId(lastKnownStop, lastKnownServiceName);
    if (seen.has(lastStopId)) {
      continue;
    }
    seen.add(lastStopId);

    const neighbours = graph[lastKnownStop.bus_stop_id] || [];
    // neighbours.forEach((x) => {
    //   const nearby = getNearbyStops(busStopsMap, x);
    //   nearby.forEach(y => {
    //     const id = getUniqueId(y, y.service_name);
    //     if (!seen.has(id)) {
    //       neighbours.push(y);
    //       seen.add(id);
    //     }
    //   });
    // });

    neighbours.forEach((x) => {
      const y = {
        ...top,
        currDistance: top.currDistance + x.distance,
        path: [
          ...top.path,
          { bus_stop_id: x.bus_stop_id,
            service_name: x.service_name,
            distance: x.distance }],
      };
      if (lastKnownServiceName !== x.service_name) {
        y.currTransfers = top.currTransfers + 1;
        y.currCost = top.currCost + perTransferCost;
      }
      y.currCost += perStopCost;
      queue.push(y);
    });
  }
  return queue.toArray();
};

export const groupBy = (xs, key) => {
  const groups = xs.reduce((acc, x) => {
    const v = key instanceof Function ? key(x) : x[key];
    const el = acc.find(r => r && r.key === v);
    if (el) {
      el.values.push(x);
    } else {
      acc.push({ key: v, values: [x] });
    }
    return acc;
  }, []);
  return groups.map(obj => obj.values);
};

export const drawPolylines = (google, routePath, startStop, endStop) => {
  const polylines = [];
  const services = _.groupBy(routePath.path || [], 'service_name');
  _.map(services, (service) => {
    const polyline = new google.maps.Polyline({
      strokeColor: service[0].color,
      strokeOpacity: 0.8,
      strokeWeight: 1.6,
      clickable: false,
      path: service,
    });
    polyline.setMap(google.map);
    polylines.push(polyline);
  });

  const lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 0.5,
    scale: 4,
  };

  if (startStop.bus_stop_id !== routePath.path[0].bus_stop_id) {
    const polyline = new google.maps.Polyline({
      strokeColor: '#ffffff',
      strokeOpacity: 0,
      strokeWeight: 2,
      clickable: false,
      icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '20px',
      }],
      path: [startStop, routePath.path[0]],
    });
    polyline.setMap(google.map);
    polylines.push(polyline);
  }

  if (endStop.bus_stop_id !== routePath.path[routePath.path.length - 1].bus_stop_id) {
    const polyline = new google.maps.Polyline({
      strokeColor: '#ffffff',
      strokeOpacity: 0,
      strokeWeight: 2,
      clickable: false,
      icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '20px',
      }],
      path: [endStop, routePath.path[routePath.path.length - 1]],
    });
    polyline.setMap(google.map);
    polylines.push(polyline);
  }
  return new Promise((resolve, reject) => {
    if (polylines) {
      resolve(polylines);
    } else {
      reject({ error: 'Unable to draw polylines' });
    }
  });
};

export const createActions = types => ({
  request(payload) {
    return {
      type: types[0],
      payload,
    };
  },
  success(payload) {
    return {
      type: types[1],
      payload,
    };
  },
  fail(error) {
    return {
      type: types[2],
      errorMessage: error || 'Something bad happened',
    };
  },
});
