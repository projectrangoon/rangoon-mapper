import { searchBusStops, getEngNames, getNearbyStops, flatternServices } from './utils';
import uniqueStops from '../../experiment/unique_stops.json';
import busStopsMap from '../../experiment/stops_map.json';


describe('Get Nearby bus stops', () => {
  it('Nearby bus stops within 500m', () => {
    const stop = {
      bus_stop_id: 118,
      name_en: 'Kili',
      lat: 16.774989,
      lng: 96.139475,
    };

    const nearbyStops = getNearbyStops(busStopsMap, stop, 0.5);
    let results = [];
    const search = uniqueStops.filter(s => s.bus_stop_id === 119 || s.bus_stop_id === 124);
    // eslint-disable-next-line no-return-assign
    search.forEach(x => results = results.concat(flatternServices(x, stop)));
    expect(nearbyStops).toEqual(results);
  });
});


describe('Searching of Bus Stops', () => {
  it('Regex test of word boundary with / inside', () => {
    const searchString = 'kone';
    const pattern = new RegExp(`(?:^|\\s+|/|.*,)${searchString}`, 'i');
    const strings = [
      'kone zay tan/lanmadaw',
      'KoNe zay tan',
      'zay tan KOne',
      'theingyi zay/KONE zay tan',
      'theingyi zay/ KONE zay tan',
      'theingyi zay/    KONE zay tan',
      'lanmakonedaw',
      'withcomma,konezay',
      'withcomma,kone zay',
      'withcomma, kone zay',
      'xxx?kone zay',
      'abc kone xyz',
      'abc konexyz',
    ];
    const result = strings.filter(s => pattern.test(s));
    const expected = [
      'kone zay tan/lanmadaw',
      'KoNe zay tan',
      'zay tan KOne',
      'theingyi zay/KONE zay tan',
      'theingyi zay/ KONE zay tan',
      'theingyi zay/    KONE zay tan',
      'withcomma,konezay',
      'withcomma,kone zay',
      'withcomma, kone zay',
      'abc kone xyz',
      'abc konexyz',
    ];
    expect(result).toEqual(expected);
  });
  it('Word boundary testing with busStops data', () => {
    const searchString = 'kone';
    let result = getEngNames(searchBusStops(uniqueStops, searchString));
    result = result.map(x => x.name_en);
    expect(result).toEqual([
      'Sae-Mile Kone',
      'Sae-Mile Kone',
      'Htan Pin Kone',
      'Htan Pin Kone',
      'Kone Zay Tan',
      'Theingyi Zay/ Kone Zay Tan',
      'Kyaung Shae/ Kone Sin',
      'Kyaung Shae/ Kone Sin',
      'Kone Padaythar',
      'Kone Padaythar',
      'Kone Taik',
      'Kone Taik',
      'Kone Padaythar',
      'Kone Padaythar',
      'Kyauk Kone',
      'Kyauk Kone',
      'Kyauk Kone',
      'Kyauk Kone',
      'Thama Kone',
      'Thama Kone',
      'Chaw Twin Kone',
      'Chaw Twin Kone',
      'Saw Bwar Gyi Kone Lan Sone',
      'Saw Bwar Gyi Kone Lan Sone',
      'Kyoe Kone',
      'Kyoe Kone',
      'Kyoe Kone Lan Sone',
      'Kyoe Kone Lan Sone',
      'Bo Kone',
      'Bo Kone',
      'Pan Chan Kone',
      'Pan Chan Kone',
      'Kone Htate',
      'Kone Htate',
      'Sae-Shit Kone',
      'Sae-Shit Kone',
      'Kalar Kone',
      'Kalar Kone',
      'Myauk Chaw Kone',
      'Myauk Chaw Kone',
      'Kan Kone',
      'Kan Kone',
      'Chaw Twin Kone',
      'Paya Kone Lan Sone',
      'Paya Kone Lan Sone',
      'Bo Tae Kone',
      'Bo Tae Kone',
      'Mhan Kone',
      'Mhan Kone',
      'Tha Pyay Kone',
      'Tha Pyay Kone',
      'Nyaung Kone',
      'Nyaung Kone',
      'Kyo Kone Lan Thit',
      'Kyo Kone Lan Thit',
      'Paya Kone',
      'Paya Kone',
      'Say Yone Kone',
      'Say Yone Kone',
      'Min Kone',
      'Min Kone',
      'Saw Bwar Gyi Kone Lan Sone',
      'Saw Bwar Gyi Kone Lan Sone',
    ]);
  });
});
