import Heap from 'heap';
import _ from 'lodash';
import { COST_PER_TRANSFER, COST_PER_STOP } from './constants/Weights';

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

export const calculateRoute = (graph, busStopsMap, startStop, endStop) => {
  const seen = new Set();
  const queue = new Heap((a, b) => a.currCost - b.currCost
    || a.currDistance - b.currDistance
    || a.currTransfers - b.currTransfers);

  queue.push({
    currCost: 0,
    currDistance: 0,
    currTransfers: 0,
    path: [{
      bus_stop_id: startStop.bus_stop_id,
      service_name: 0,
    }],
  });

  while (queue.size()) {
    const top = queue.pop();
    const lastKnownStop = top.path[top.path.length - 1];
    const lastKnownServiceName = lastKnownStop.service_name;
    if (lastKnownStop.bus_stop_id === endStop.bus_stop_id) {
      const result = {
        ...top,
        currTransfers: top.currTransfers - 1,
      };

      if (result.path.length >= 2) {
        result.path[0].service_name = result.path[1].service_name;
      }
      return result;
    }

    const lastStopId = getUniqueId(lastKnownStop, lastKnownServiceName);
    if (seen.has(lastStopId)) {
      continue;
    }
    seen.add(lastStopId);

    const neighbours = graph[lastKnownStop.bus_stop_id] || [];
    neighbours.forEach((x) => {
      const y = {
        ...top,
        currDistance: top.currDistance + x.distance,
        path: [...top.path, { bus_stop_id: x.bus_stop_id, service_name: x.service_name }],
      };
      if (lastKnownServiceName !== x.service_name) {
        y.currTransfers = top.currTransfers + 1;
        y.currCost = top.currCost + COST_PER_TRANSFER;
      }
      y.currCost += COST_PER_STOP;
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
