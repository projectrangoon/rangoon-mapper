import { Cause, Effect, Exit, Option } from 'effect';

import { DataLoadError, formatDataLoadError, loadStaticData } from '@/lib/dataLoader';

const fixtureStop = {
  bus_stop_id: 1,
  lat: 16.8,
  lng: 96.1,
  name_en: 'Stop 1',
  name_mm: 'မှတ်တိုင် ၁',
  road_en: 'Road',
  road_mm: 'လမ်း',
  township_en: 'Township',
  township_mm: 'မြို့နယ်',
  services: [{ service_name: 1, color: '#000', sequence: 1 }],
};

const responses = {
  '/data/adjancencyList.json': { '1': [] },
  '/data/stops_map.json': { '1': fixtureStop },
  '/data/bus_services.json': { '1': { color: '#000', service_name: 'A', service_no: 1, stops: [fixtureStop] } },
  '/data/unique_stops.json': [fixtureStop],
  '/data/route_shapes.json': { '1': [{ lat: fixtureStop.lat, lng: fixtureStop.lng }] },
};

describe('loadStaticData', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads and normalizes the static data through Effect', async () => {
    vi.spyOn(window, 'fetch').mockImplementation(async (input) => {
      const key = typeof input === 'string' ? input : input.toString();
      const body = responses[key as keyof typeof responses];
      return {
        ok: true,
        status: 200,
        json: async () => body,
      } as Response;
    });

    const data = await Effect.runPromise(loadStaticData());

    expect(data.busStopsMap[1]?.name_en).toBe('Stop 1');
    expect(data.busServices['1']?.shape).toEqual([{ lat: 16.8, lng: 96.1 }]);
    expect(data.uniqueStops).toHaveLength(1);
  });

  it('returns a typed DataLoadError when a request fails', async () => {
    vi.spyOn(window, 'fetch').mockResolvedValue({ ok: false, status: 500 } as Response);

    const exit = await Effect.runPromiseExit(loadStaticData());

    expect(Exit.isFailure(exit)).toBe(true);
    if (!Exit.isFailure(exit)) {
      throw new Error('Expected data loader effect to fail');
    }

    const maybeError = Cause.failureOption(exit.cause);
    const error = Option.isSome(maybeError) ? maybeError.value : null;

    expect(error).toBeInstanceOf(DataLoadError);
    expect(error).toMatchObject({
      url: '/data/adjancencyList.json',
      reason: 'Failed to fetch (500)',
    });
  });

  it('formats loader errors for app display', () => {
    expect(
      formatDataLoadError(new DataLoadError({ url: '/data/stops_map.json', reason: 'boom' })),
    ).toBe('/data/stops_map.json: boom');
  });
});
