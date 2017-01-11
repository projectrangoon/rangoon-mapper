import lxml
import bs4
import requests
import re
import ast
import json

HEADERS = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.77 Safari/537.36'}

bus_lines = []
routes = range(1, 61)
routes.remove(13)
for bus in routes:
    line = {}
    route_page = 'http://www.yangonbus.com/services/route%d/index.html' % bus
    response = requests.get(route_page, headers=HEADERS)

    line['route'] = bus
    if response.status_code == 200:
        search = re.search(r'\$\.each\(\[.*\]\,', response.text)
        if search:
            rogue = search.group(0).strip('$.each(')
            lnglat = ast.literal_eval(rogue)[0]
            stops = []
            for x in lnglat:
                stops.append({'lng': x[0], 'lat': x[1]})
            line['stops'] = stops

    f = open('route%d.json' % bus, 'wb')
    f.write(json.dumps(line))
    f.close()
