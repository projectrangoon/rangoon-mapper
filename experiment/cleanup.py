import json
from itertools import groupby
from pprint import pprint
from operator import itemgetter

print 'Loading JSON'
bus_stops = json.loads(open('unique_stops.json', 'rb').read())
bus_stops = sorted(bus_stops, key=itemgetter('bus_stop_id'))

all_bus_stops = json.loads(open('all_bus_stops.json', 'rb').read())
all_bus_stops = sorted(all_bus_stops, key=itemgetter('service_name'))


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


if __name__ == '__main__':
    print 'Initializing Graph'
    graph = {}
    services = groupby(all_bus_stops, key=itemgetter('service_name'))
    for service_no, stops in services:
        stops = list(stops)
        for stop in stops[:-1]:
            key = stop['bus_stop_id']
            if key not in graph:
                graph[key] = []

            next_stop = stops[stops.index(stop) + 1]
            distance = get_distance(stop['lng'], stop['lat'],
                                    next_stop['lng'], next_stop['lat'])
            assert distance >= 0, (stop, next_stop)
            next_stop['distance'] = distance
            graph[key] += [next_stop]

    with open('test.json', 'wb') as f:
        f.write(json.dumps(graph))
