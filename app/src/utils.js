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
  const sn = _.padStart(serviceName.toString(), 2, '0');
  const busStopId = _.padStart(busStop.bus_stop_id.toString(), 5, 'Z');
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
    path: [startStop],
    serviceNames: [0],
  });

  while (queue.size()) {
    const top = queue.pop();
    // console.log(top.path[top.path.length - 1]);

    const lastKnownStop = top.path[top.path.length - 1];
    const lastKnownServiceName = top.serviceNames[top.serviceNames.length - 1];
    if (lastKnownStop.bus_stop_id === endStop.bus_stop_id) {
      return top;
    }

    const lastStopId = getUniqueId(lastKnownStop, lastKnownServiceName);
    if (seen.has(lastStopId)) {
      continue;
    }
    seen.add(lastStopId);

    const neighbours = graph[lastKnownStop.bus_stop_id] || [];
    // console.log('neighbour from graph', neighbours);
    neighbours.forEach((x) => {
      if (x) {
        const y = {
          ...top,
          currDistance: top.currDistance + x.distance,
          path: [...top.path, busStopsMap[x.bus_stop_id]],
          serviceNames: [...top.serviceNames, x.service_name],
        };
        if (lastKnownServiceName !== x.service_name) {
          y.currTransfers = ++top.currTransfers;
          y.currCost = top.curCost + COST_PER_TRANSFER;
        }
        y.currCost += COST_PER_STOP;
        queue.push(y);
      }
    });
  }
  return queue.toArray();
};
