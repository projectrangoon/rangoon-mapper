const entityMap: Record<string, string> = {
  '&lrarr;': '↔',
  '&harr;': '↔',
  '&rarr;': '→',
  '&larr;': '←',
  '&amp;': '&',
};

const entityPattern = new RegExp(Object.keys(entityMap).join('|'), 'g');

export const normalizeServiceName = (value: string): string => {
  return value.replace(entityPattern, (match) => entityMap[match] ?? match);
};
