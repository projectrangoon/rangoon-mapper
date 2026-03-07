import type { UniqueStop } from '@/types';

const englishPattern = /^[A-Za-z0-9 ]*$/;

const escapeRegExp = (input: string): string =>
  input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const isEnglish = (text: string): boolean => englishPattern.test(text);

export const searchBusStops = (allStops: UniqueStop[], rawSearchString: string): UniqueStop[] => {
  const searchString = rawSearchString.trim();
  if (!searchString) {
    return [];
  }

  const pattern = new RegExp(`(?:^|\\s+|/|,\\s*)${escapeRegExp(searchString)}`, 'i');

  return allStops.filter((stop) => {
    if (isEnglish(searchString)) {
      return (
        pattern.test(stop.name_en) ||
        pattern.test(stop.road_en) ||
        pattern.test(stop.township_en)
      );
    }

    return (
      pattern.test(stop.name_mm) ||
      pattern.test(stop.road_mm) ||
      pattern.test(stop.township_mm)
    );
  });
};
