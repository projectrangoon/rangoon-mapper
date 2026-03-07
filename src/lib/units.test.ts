import { formatImperialDistance, formatImperialWalkDistance } from '@/lib/units';

describe('units', () => {
  it('formats route distance in miles', () => {
    expect(formatImperialDistance(0.5)).toBe('0.31 mi');
    expect(formatImperialDistance(7.33)).toBe('4.55 mi');
  });

  it('formats short walk distance in feet and longer walks in miles', () => {
    expect(formatImperialWalkDistance(0.046)).toBe('151 ft');
    expect(formatImperialWalkDistance(0.385)).toBe('0.24 mi');
  });
});
