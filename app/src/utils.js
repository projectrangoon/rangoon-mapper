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

export const getUniqueId = (busStop) => {
  const route = _.padStart(busStop.service_name.toString(), 2, '0');
  const seq = _.padStart(busStop.sequence.toString(), 2, '0');
  return `${route}${seq}${busStop.bus_stop_id}`;
};

export const getEngNames = busStops => busStops.map(x => _.pick(x, 'name_en'));

export const getNames = busStops => busStops.map(x => _.pick(x, 'name_en', 'sequence', 'route'));

export const calculateRoute = (graph, startPoint, endPoint) => {
  const seen = new Set();
  const queue = new Heap((a, b) => a.currDistance - b.currDistance);

  queue.push({
    currCost: 0,
    currDistance: 0,
    currTransfers: 0,
    path: [startPoint],
  });
  while (queue.size()) {
    const top = queue.pop();

    const lastKnownStop = top.path[top.path.length - 1];


    if (lastKnownStop.bus_stop_id === endPoint.bus_stop_id) {
      return {
        ...top,
        path: stripDistance(top.path),
      };
    }

    const lastStopId = getUniqueId(lastKnownStop);
    if (seen.has(lastStopId)) {
      continue;
    }
    seen.add(lastStopId);

    const neighbours = graph[lastKnownStop.bus_stop_id] || [];
    neighbours.forEach((x) => {
      const y = {
        ...top,
        currDistance: top.currDistance + x.distance,
        path: [...top.path, x],
      };
      if (lastKnownStop.service_name === x.service_name) {
        y.currTransfers = ++top.currTransfers;
        y.currCost = top.curCost + COST_PER_TRANSFER;
      }
      y.currCost += COST_PER_STOP;
      queue.push(y);
    });
  }
  return queue.toArray();
};
