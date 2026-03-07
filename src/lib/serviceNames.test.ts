import { normalizeServiceName } from '@/lib/serviceNames';

describe('normalizeServiceName', () => {
  it('decodes legacy arrow entities from the bus service dataset', () => {
    expect(normalizeServiceName('လှည်းကူးဈေးရှေ့ &lrarr; စံပြဈေး')).toBe('လှည်းကူးဈေးရှေ့ ↔ စံပြဈေး');
    expect(normalizeServiceName('A &rarr; B')).toBe('A → B');
  });
});
