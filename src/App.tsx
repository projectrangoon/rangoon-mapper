import { Effect } from 'effect';
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { formatDataLoadError, loadStaticData, type DataLoadError } from '@/lib/dataLoader';
import AppRouter from '@/router/AppRouter';
import { useMapStore } from '@/stores/useMapStore';

export default function App() {
  const loadData = useMapStore((state) => state.loadData);
  const isDataReady = useMapStore((state) => state.isDataReady);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    void Effect.runPromise(
      loadStaticData(controller.signal).pipe(
        Effect.tap((data) =>
          Effect.sync(() => {
            if (active) {
              loadData(data);
            }
          }),
        ),
        Effect.catchAll((fetchError: DataLoadError) =>
          Effect.sync(() => {
            if (active) {
              setError(formatDataLoadError(fetchError));
            }
          }),
        ),
      ),
    );

    return () => {
      active = false;
      controller.abort();
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
