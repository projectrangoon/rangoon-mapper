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
  const pattern = new RegExp(`(?:^|\\|/|,s)${searchString}`, 'gi');
  return pattern.test(stop.name_en);
});


export const stripDistance = busStops => busStops.map(x => _.omit(x, 'distance'));

export const getUniqueId = (busStop) => {
  const route = _.padStart(busStop.service_name.toString(), 2, '0');
  const seq = _.padStart(busStop.sequence.toString(), 2, '0');
  return `${route}${seq}${busStop.bus_stop_id}`;
};

export const getEngNames = busStops => busStops.map(x => _.pick(x, 'name_en'));

export const getNames = busStops => busStops.map(x =>
  ({ name_en: x.name_en, sequence: x.sequence, route: x.route }));

export const calculateRoute = (graph, startPoint, endPoint) => {
  const seen = new Set();
  const queue = new Heap((a, b) => a.currDistance - b.currDistance);

  queue.push({
    currDistance: 0,
    path: [startPoint],
  });
  while (queue.size()) {
    const top = queue.pop();

    const lastKnownStop = top.path[top.path.length - 1];


    if (lastKnownStop.bus_stop_id === endPoint.bus_stop_id) {
      return stripDistance(top.path);
    }

    if (seen.has(getUniqueId(lastKnownStop))) {
      continue;
    }
    seen.add(getUniqueId(lastKnownStop));

    const neighbours = graph[lastKnownStop.bus_stop_id.toString()] || [];
    neighbours.forEach((x) => {
      queue.push({
        currDistance: x.distance,
        path: [...top.path, x],
      });
    });
  }
  return queue.toArray();
};
