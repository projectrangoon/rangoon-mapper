from pprint import pprint
import csv
import json

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
            'lat': bus['lat'],
            'lng': bus['lng'],
            'services': [
                {
                    'service_name': bus['service_name'],
                    'sequence': bus['sequence']
                }
            ]
        }
    else:
        unique_stops[bus['bus_stop_id']]['services'].append({
            'service_name': bus['service_name'],
            'sequence': bus['sequence']
        })

with open('unique_stops.json', 'wb') as f:
    f.write(json.dumps(unique_stops))