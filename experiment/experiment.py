from pprint import pprint
from operator import itemgetter
import csv
import json
import itertools

with open('bus_stops_by_service_000115.tsv') as f:
    raw_data = csv.reader(f, delimiter='\t')
    bus_stops = []
    for row in raw_data:
        stop = {
            'service_name': row[0],
            'sequence': row[1],
            'bus_stop_id': row[2],
            'name_en': row[3],
            'name_mm': row[4],
            'road_en': row[5],
            'road_mm': row[6],
            'township_en': row[7],
            'township_mm': row[8],
            'lat': row[9],
            'lng': row[10]
        }
        bus_stops.append(stop)
    bus_stops = bus_stops[1:]
    for b in bus_stops:
        b['service_name'] = int(b['service_name'])
        b['sequence'] = int(b['sequence'])
        b['bus_stop_id'] = int(b['bus_stop_id'])




with open('all_bus_stops.json', 'wb') as f:
    f.write(json.dumps(bus_stops))


unique_stops = {}
for bus in bus_stops:
    if bus['bus_stop_id'] not in unique_stops:
        unique_stops[bus['bus_stop_id']] = {
            'name_en': bus['name_en'],
            'name_mm': bus['name_mm'],
            'road_en': bus['road_en'],
            'road_mm': bus['road_mm'],
            'township_en': bus['township_en'],
            'township_mm': bus['township_mm'],
            'lat': float(bus['lat']),
            'lng': float(bus['lng']),
            'services': [
                {
                    'service_name': int(bus['service_name']),
                    'sequence': int(bus['sequence'])
                }
            ]
        }
    else:
        unique_stops[bus['bus_stop_id']]['services'].append({
            'service_name': int(bus['service_name']),
            'sequence': int(bus['sequence'])
        })
stops = []
for id, value in unique_stops.iteritems():
    value['bus_stop_id'] = id
    stops.append(value)
    

with open('unique_stops.json', 'wb') as f:
    f.write(json.dumps(stops))

bus_stops = sorted(bus_stops, key=lambda x: (x['service_name'], x['sequence']))
bus_stops = itertools.groupby(bus_stops, key=itemgetter('service_name'))

all_bus_stops = {}
for routeNo, stops in bus_stops:
    all_bus_stops[int(routeNo)] = list(stops)


with open('all_bus_routes.json', 'wb') as f:
    f.write(json.dumps(list(bus_stops)))


