import { create } from 'zustand';

interface BusStoreState {
  selectedServices: Set<string>;
  expandedService: string | null;
  toggleService: (serviceName: string) => void;
  clearServices: () => void;
  setExpandedService: (serviceName: string | null) => void;
  selectOnly: (serviceName: string) => void;
}

export const useBusStore = create<BusStoreState>((set) => ({
  selectedServices: new Set<string>(),
  expandedService: null,
  toggleService: (serviceName) => {
    set((state) => {
      const selectedServices = new Set(state.selectedServices);
      if (selectedServices.has(serviceName)) {
        selectedServices.delete(serviceName);
      } else {
        selectedServices.add(serviceName);
      }
      return { selectedServices };
    });
  },
  clearServices: () => {
    set({ selectedServices: new Set<string>() });
  },
  setExpandedService: (serviceName) => {
    set({ expandedService: serviceName });
  },
  selectOnly: (serviceName) => {
    set({ selectedServices: new Set([serviceName]) });
  },
}));
