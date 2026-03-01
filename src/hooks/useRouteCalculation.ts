import { useEffect } from 'react';

import { useMapStore } from '@/stores/useMapStore';

export const useRouteCalculation = () => {
  const startStop = useMapStore((state) => state.startStop);
  const endStop = useMapStore((state) => state.endStop);
  const isCalculating = useMapStore((state) => state.isCalculating);
  const calculateCurrentRoute = useMapStore((state) => state.calculateCurrentRoute);

  useEffect(() => {
    if (!startStop || !endStop) {
      return;
    }
    void calculateCurrentRoute();
  }, [startStop, endStop, calculateCurrentRoute]);

  return {
    isCalculating,
  };
};
