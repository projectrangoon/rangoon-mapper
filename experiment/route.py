from operator import itemgetter
from pprint import pprint
import json
import sys
import itertools
start = sys.argv[1]
end = sys.argv[2]
cost_per_stop = float(sys.argv[3]) # 0.5
cost_per_transfer = float(sys.argv[4]) # 5

print 'Loading JSON'
bus_stops = json.loads(open('all_bus_stops.json', 'rb').read())
# stops = [{'service_name': x['service_name'], 'sequence': x['sequence'], 'bus_stop_id': x['bus_stop_id'], 'name_en': x['name_en']} for x in stops]
bus_stops = sorted(bus_stops, key=lambda x: (int(x['service_name']), int(x['sequence'])))


def get_name(bus_stop_id):
    for stop in bus_stops:
        if stop['bus_stop_id'] == bus_stop_id:
            return (bus_stop_id, stop['name_en'] )
    return bus_stop_id


def get_route_no_and_seq(bus_stop_id):
    for stop in bus_stops:
        if stop['bus_stop_id'] == bus_stop_id:
            return stop['service_name'], stop['sequence']
    return bus_stop_id, bus_stop_id


def get_distance(lon1, lat1, lon2, lat2):
    from math import radians, cos, sin, asin, sqrt
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    # haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    km = 6367 * c
    return km

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
    stops = list(stops)
    for stop in stops[:-1]:
        current_index = stops.index(stop)
        key = stop['bus_stop_id']
        if key not in graph:
            graph[key] = list()

        current_stop = stop
        next_stop = stops[current_index + 1]
        distance = get_distance(float(current_stop['lng']), float(current_stop['lat']), float(next_stop['lng']), float(next_stop['lat']))
        assert distance >= 0, (current_stop, next_stop)

        next_stop['distance'] = distance
        graph[key].append(next_stop)
        # graph[key][(next_stop['bus_stop_id'], next_stop['service_name'])] = distance

for key, value in graph.iteritems():
    graph[key] = dict((v['bus_stop_id'], v) for v in value).values()


with open('adjancencyList.json', 'wb') as f:
    f.write(json.dumps(graph))



# print 'Breadth First Search'
# def bfs(graph, start, end):
#     from Queue import Queue
#     seen = set()
#     queue = Queue()
#     queue.put((0, [start]))

#     while queue:
#         (curr_distance, path) = queue.get()
#         node = path[-1]
#         if node == end:
#             return path

#         if node in seen:
#             continue
#         seen.add(node)

#         for adjacent, distance in graph.get(node, {}).items():
#             new_path = list(path)
#             new_path.append(adjacent)
#             queue.put(queue, (curr_distance, new_path))


# # path = bfs(graph, start, end)
# # pprint(map(get_name, path))

# print 'Dijkstra with (Per stop cost: %f, Transfer Cost: %f)' % (cost_per_stop, cost_per_transfer)
# def dijkstra(graph, start, end):
#     import heapq
#     seen = set()
#     queue = []

#     # put the first path into the queue
#     heapq.heappush(queue, (0, 0, 0, [(start, None)]))
#     while queue:
#         (curr_cost, curr_distance, curr_transfers, path) = heapq.heappop(queue)


#         # get the last node from the path
#         (node, curr_service) = path[-1]
#         if node == end:
#             return (curr_cost, curr_distance, curr_transfers, path)

#         if (node, curr_service) in seen:
#             continue
#         seen.add((node, curr_service))

#         for (adjacent, service), distance in graph.get(node, {}).items():
#             new_path = list(path)
#             new_path.append((adjacent, service))
#             new_distance = curr_distance + distance
#             new_cost = distance + curr_cost
#             new_transfers = curr_transfers
#             if curr_service != service:
#                 new_cost += cost_per_transfer
#                 new_transfers += 1
#             new_cost += cost_per_stop

#             heapq.heappush(queue, (new_cost, new_distance, new_transfers, new_path))

# (cost, distance, transfers, path) = dijkstra(graph, start, end)

# for bus_id, service in path:
#     print service, get_name(bus_id)
# print "cost: ", cost
# print "length: ", len(path)
# print "transfers: ", transfers

