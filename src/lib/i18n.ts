import type { AppLocale, BusStop, RouteStep, UniqueStop } from '@/types';

type TranslatedKey =
  | 'routingTo'
  | 'chooseDestination'
  | 'quickestJourneyCaption'
  | 'live'
  | 'waypoints'
  | 'from'
  | 'to'
  | 'guidance'
  | 'searchStopsPlaceholder'
  | 'searchStopsAria'
  | 'searchBusStopPlaceholder'
  | 'searchNoMatch'
  | 'searchNoStop'
  | 'calculating'
  | 'timelineEmpty'
  | 'busLines'
  | 'busLinesCaption'
  | 'eta'
  | 'distance'
  | 'transfers'
  | 'transitLeg'
  | 'walkLeg';

const copy: Record<AppLocale, Record<TranslatedKey, string>> = {
  en: {
    routingTo: 'Routing To',
    chooseDestination: 'Choose destination',
    quickestJourneyCaption: 'Find the quickest Yangon bus journey across connected services.',
    live: 'Live',
    waypoints: 'Waypoints',
    from: 'From',
    to: 'To',
    guidance: 'Guidance',
    searchStopsPlaceholder: 'Search stops, roads, townships',
    searchStopsAria: 'Search Stops',
    searchBusStopPlaceholder: 'Search bus stop',
    searchNoMatch: 'No matching stops',
    searchNoStop: 'No stop found',
    calculating: 'Calculating shortest path...',
    timelineEmpty: 'Select start and end stops to get route details.',
    busLines: 'Bus Lines',
    busLinesCaption: 'Toggle services to draw lines and animate vehicles on the map.',
    eta: 'ETA',
    distance: 'Distance',
    transfers: 'Transfers',
    transitLeg: 'Transit leg',
    walkLeg: 'Walk leg',
  },
  my: {
    routingTo: 'ဦးတည်ရာ',
    chooseDestination: 'ပန်းတိုင်ရွေးပါ',
    quickestJourneyCaption: 'ချိတ်ဆက်ထားသော ဝန်ဆောင်မှုများအတွင်း အမြန်ဆုံး ရန်ကုန်ဘတ်စ်ခရီးစဉ်ကို ရှာပါ။',
    live: 'တိုက်ရိုက်',
    waypoints: 'မှတ်တိုင်များ',
    from: 'စမှတ်',
    to: 'ပန်းတိုင်',
    guidance: 'လမ်းညွှန်',
    searchStopsPlaceholder: 'မှတ်တိုင်၊ လမ်း၊ မြို့နယ် ရှာရန်',
    searchStopsAria: 'မှတ်တိုင်ရှာရန်',
    searchBusStopPlaceholder: 'ဘတ်စ်မှတ်တိုင်ရှာရန်',
    searchNoMatch: 'ကိုက်ညီသည့် မှတ်တိုင်များ မရှိပါ',
    searchNoStop: 'မှတ်တိုင် မတွေ့ပါ',
    calculating: 'အတိုဆုံးလမ်းကြောင်း တွက်ချက်နေသည်...',
    timelineEmpty: 'လမ်းကြောင်းအသေးစိတ်ကြည့်ရန် စမှတ်နှင့် ပန်းတိုင်ရွေးပါ။',
    busLines: 'ဘတ်စ်လိုင်းများ',
    busLinesCaption: 'ဝန်ဆောင်မှုများကို ဖွင့်ပိတ်ပြီး မြေပုံပေါ်တွင် လိုင်းများနှင့် ယာဉ်လှုပ်ရှားမှုကို ပြပါ။',
    eta: 'ကြာချိန်',
    distance: 'အကွာအဝေး',
    transfers: 'လဲပြောင်း',
    transitLeg: 'ဘတ်စ်ခရီးစဉ်',
    walkLeg: 'လမ်းလျှောက်',
  },
};

interface NamedValue {
  name_en?: string;
  name_mm?: string;
}

interface MetaValue extends NamedValue {
  road_en?: string;
  road_mm?: string;
  township_en?: string;
  township_mm?: string;
}

export const t = (locale: AppLocale, key: TranslatedKey): string => copy[locale][key];

export const getLocalizedName = (value: NamedValue, locale: AppLocale): string => {
  if (locale === 'my') {
    return value.name_mm || value.name_en || '';
  }

  return value.name_en || value.name_mm || '';
};

export const getLocalizedRoad = (value: MetaValue, locale: AppLocale): string => {
  if (locale === 'my') {
    return value.road_mm || value.road_en || '';
  }

  return value.road_en || value.road_mm || '';
};

export const getLocalizedTownship = (value: MetaValue, locale: AppLocale): string => {
  if (locale === 'my') {
    return value.township_mm || value.township_en || '';
  }

  return value.township_en || value.township_mm || '';
};

export const formatStopMeta = (value: MetaValue, locale: AppLocale): string => {
  const road = getLocalizedRoad(value, locale);
  const township = getLocalizedTownship(value, locale);

  if (road && township) {
    return `${road} · ${township}`;
  }

  return road || township;
};

export const getLocalizedStopName = (value: BusStop | UniqueStop | RouteStep, locale: AppLocale): string =>
  getLocalizedName(value, locale);

export const formatWalkTo = (locale: AppLocale, stopName: string): string =>
  locale === 'my' ? `${stopName} သို့ လမ်းလျှောက်ပါ` : `Walk to ${stopName}`;

export const formatRideService = (locale: AppLocale, serviceName: number): string =>
  locale === 'my' ? `YBS ${serviceName} စီးပါ` : `Take YBS ${serviceName}`;

export const formatTransferLabel = (locale: AppLocale, serviceName: number, nextServiceName: number): string =>
  locale === 'my'
    ? `ပြောင်း ${serviceName} → ${nextServiceName}`
    : `Transfer ${serviceName} → ${nextServiceName}`;

export const formatBoardLabel = (locale: AppLocale, serviceName: number): string =>
  locale === 'my' ? `YBS ${serviceName} စတင်စီး` : `Board YBS ${serviceName}`;

export const formatExitLabel = (locale: AppLocale, serviceName: number): string =>
  locale === 'my' ? `YBS ${serviceName} မှ ဆင်း` : `Exit YBS ${serviceName}`;

export const formatStopCount = (locale: AppLocale, count: number): string => {
  if (locale === 'my') {
    return `မှတ်တိုင် ${count} ခု`;
  }

  return `${count} stop${count === 1 ? '' : 's'}`;
};
