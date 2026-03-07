import { formatStopMeta, formatWalkTo, getLocalizedStopName } from '@/lib/i18n';
import type { BusStop } from '@/types';

const stop: BusStop = {
  bus_stop_id: 1,
  lat: 16.8,
  lng: 96.1,
  name_en: 'Maw Tin',
  name_mm: 'မော်တင်',
  road_en: 'Strand Road',
  road_mm: 'ကမ်းနားလမ်း',
  township_en: 'Lanmadaw',
  township_mm: 'လမ်းမတော်',
  services: [],
};

describe('i18n helpers', () => {
  it('returns localized stop labels and metadata', () => {
    expect(getLocalizedStopName(stop, 'en')).toBe('Maw Tin');
    expect(getLocalizedStopName(stop, 'my')).toBe('မော်တင်');
    expect(formatStopMeta(stop, 'en')).toBe('Strand Road · Lanmadaw');
    expect(formatStopMeta(stop, 'my')).toBe('ကမ်းနားလမ်း · လမ်းမတော်');
  });

  it('formats walk copy per locale', () => {
    expect(formatWalkTo('en', 'Japan Lan')).toBe('Walk to Japan Lan');
    expect(formatWalkTo('my', 'ဂျပန်လမ်း')).toBe('ဂျပန်လမ်း သို့ လမ်းလျှောက်ပါ');
  });
});
