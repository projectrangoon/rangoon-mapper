import { Queue } from 'es-collections';
import types from '../constants/ActionTypes';

export const handlePlacesChanged = places => ({
  type: types.PLACES_CHANGED,
  places,
});

export const updateMapCenter = center => ({
  type: types.UPDATE_MAP_CENTER,
  center,
});

export const adjacencyListLoaded = graph => ({
  type: types.AJACENCY_LIST_LOADED,
  graph,
});

export const calculateRoute = (graph, startStop, endStop) => {
  const routeMarkers = [];
  routeMarkers.push({ lat: parseFloat(startStop.lat), lng: parseFloat(startStop.lng) });
  routeMarkers.push({ lat: parseFloat(endStop.lat), lng: parseFloat(endStop.lng) });

  // var heap = require('heap');
  // let seen = set();
  // let queue = []

  // heap.push(queue)

  console.log(endStop['bus_stop_id']);

  const queue = new Queue();
  const seen = new Set();

  queue.enqueue([startStop]);

  while (queue.size) {
    console.log('Queue');
    queue.forEach(x => console.log(x));
    let path = queue.dequeue();
    console.log("path", path);
    let node = path.slice(-1)[0];
    console.log('node', node, node['bus_stop_id'], endStop['bus_stop_id']);
    if (node['bus_stop_id'] === endStop['bus_stop_id']) {
      console.log('Done', path);
      debugger;
      break;
    }

    if (seen.has(node)) {
      continue;
    }
    seen.add(node);

    const adjacents = graph[node['bus_stop_id']];
    console.log('adjacents', adjacents);
    if (adjacents) {
      adjacents.forEach(stop => {
        var newPath = path.concat(stop);
        queue.enqueue(newPath);
      });
    }

    // debugger;

  }



  // queue.enqueue({ currDistance: 0, path: [startStop] });


  // while (queue) {
  //   console.log(queue.size);

  //   let x = queue.dequeue();
  //   console.log('from queue', x);
  //   let node = x.path.slice(-1)[0];
  //   if (node['bus_stop_id'] === endStop['bus_stop_id']) {
  //     console.log('Done', x.path);
  //   }

  //   if (seen.has(node)) {
  //     continue;
  //   }
  //   seen.add(node);

  //   const adjacents = graph[node['bus_stop_id']];
  //   if (adjacents) {
  //     adjacents.forEach((stop) => {
  //       var new_path = [node];
  //       new_path.push(stop.stop);
  //       console.log("new_path", new_path);
  //       queue.enqueue({ currDistance: stop.distance, path: new_path})
  //     });
  //   }
  // }





  return {
    type: types.CALCULATE_ROUTE,
    routeMarkers,
  };
};

