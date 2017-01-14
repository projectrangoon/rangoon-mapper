from operator import itemgetter
from pprint import pprint
import json
import sys
import itertools
start = sys.argv[1]
end = sys.argv[2]

print 'Loading JSON'
bus_stops = json.loads(open('bus_stops.json', 'rb').read())
# stops = [{'service_name': x['service_name'], 'sequence': x['sequence'], 'bus_stop_id': x['bus_stop_id'], 'name_en': x['name_en']} for x in stops]
bus_stops = sorted(bus_stops, key=lambda x: (int(x['service_name']), int(x['sequence'])))


def get_name(bus_stop_id):
    for stop in bus_stops:
        if stop['bus_stop_id'] == bus_stop_id:
            return stop['name_en']
    return bus_stop_id


    # tx = filter(lambda x: x['bus_stop_id'] == unicode(bus_stop_id), stops)
    # if tx:
    #     return tx[0]['name_en']
    # else:
    #     return bus_stop_id



def get_id(name):
    return filter(lambda x: x['name_en'] == name, bus_stops)


print 'Initializing Graph'
graph = {}
groups = itertools.groupby(bus_stops, key=itemgetter('service_name'))
for no, stops in groups:
    stops = sorted(list(stops), key=lambda x: int(x['sequence']))
    for stop in stops:
        current_index = stops.index(stop)
        key = stop['bus_stop_id']
        if key not in graph:
            graph[key] = set()
        try:
            graph[key].update([stops[current_index+1]['bus_stop_id']])
        except IndexError:
            pass


print ' Breadth First Search'


def bfs(graph, start, end):
    from Queue import Queue
    seen = set()
    queue = Queue()
    queue.put([start])

    while queue:
        path = queue.get()
        node = path[-1]
        if node == end:
            return path

        if node in seen:
            continue
        seen.add(node)

        for adjacent in graph.get(node, []):
            new_path = list(path)
            new_path.append(adjacent)
            queue.put(new_path)

path = bfs(graph, start, end)
# print path
pprint(map(get_name, path))
# print len(bus_stops)
# pprint([get_name(x) for x in path])
