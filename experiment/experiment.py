import csv
import json

with open('bus_stops_by_service_000114.tsv') as f:
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

with open('bus_stops.json', 'wb') as f:
    f.write(json.dumps(bus_stops[1:]))