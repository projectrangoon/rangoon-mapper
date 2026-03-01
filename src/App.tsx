import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { loadStaticData } from '@/lib/dataLoader';
import AppRouter from '@/router/AppRouter';
import { useMapStore } from '@/stores/useMapStore';

export default function App() {
  const loadData = useMapStore((state) => state.loadData);
  const isDataReady = useMapStore((state) => state.isDataReady);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const data = await loadStaticData();
        if (!active) {
          return;
        }

        loadData(data);
      } catch (fetchError) {
        if (!active) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load app data');
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [loadData]);

  if (error) {
    return (
      <main className="app-shell">
        <section className="welcome-panel">
          <h1>Unable to load data</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (!isDataReady) {
    return (
      <main className="app-shell">
        <section className="welcome-panel">
          <h1>Rangoon Mapper</h1>
          <p>Loading Yangon transit graph...</p>
        </section>
      </main>
    );
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
