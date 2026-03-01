import { useBusStore } from '@/stores/useBusStore';

describe('useBusStore', () => {
  beforeEach(() => {
    useBusStore.setState({
      selectedServices: new Set<string>(),
      expandedService: null,
    });
  });

  it('toggles service selection', () => {
    useBusStore.getState().toggleService('1');
    expect(useBusStore.getState().selectedServices.has('1')).toBe(true);

    useBusStore.getState().toggleService('1');
    expect(useBusStore.getState().selectedServices.has('1')).toBe(false);
  });

  it('selects only one service', () => {
    useBusStore.getState().toggleService('1');
    useBusStore.getState().toggleService('2');
    useBusStore.getState().selectOnly('3');

    expect(Array.from(useBusStore.getState().selectedServices)).toEqual(['3']);
  });
});
