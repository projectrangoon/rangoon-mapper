import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useRouteCalculation } from '@/hooks/useRouteCalculation';
import { useTheme } from '@/hooks/useTheme';
import AppLayout from '@/components/layout/AppLayout';
import { useAppStore } from '@/stores/useAppStore';
import { useBusStore } from '@/stores/useBusStore';
import { useMapStore } from '@/stores/useMapStore';

const parseStopId = (value: string | undefined): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

export default function MainPage() {
  const { startStop: startStopParam, endStop: endStopParam, serviceName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const mode = useAppStore((state) => state.mode);
  const setMode = useAppStore((state) => state.setMode);
  const uniqueStops = useMapStore((state) => state.uniqueStops);
  const isDataReady = useMapStore((state) => state.isDataReady);
  const getStopById = useMapStore((state) => state.getStopById);
  const startStop = useMapStore((state) => state.startStop);
  const endStop = useMapStore((state) => state.endStop);
  const routePath = useMapStore((state) => state.routePath);
  const setStartStop = useMapStore((state) => state.setStartStop);
  const setEndStop = useMapStore((state) => state.setEndStop);
  const selectedServices = useBusStore((state) => state.selectedServices);
  const selectOnly = useBusStore((state) => state.selectOnly);

  const { preference, setPreference, toggleTheme } = useTheme();
  const { isCalculating } = useRouteCalculation();

  useEffect(() => {
    if (location.pathname.startsWith('/bus')) {
      setMode('lines');
      return;
    }

    setMode('route');
  }, [location.pathname, setMode]);

  useEffect(() => {
    if (!isDataReady) {
      return;
    }

    const startId = parseStopId(startStopParam);
    const endId = parseStopId(endStopParam);
    if (!startId || !endId) {
      return;
    }

    const start = getStopById(startId);
    const end = getStopById(endId);

    if (start) {
      setStartStop(start);
    }
    if (end) {
      setEndStop(end);
    }
  }, [startStopParam, endStopParam, getStopById, isDataReady, setStartStop, setEndStop]);

  useEffect(() => {
    if (!serviceName) {
      return;
    }

    selectOnly(serviceName);
  }, [serviceName, selectOnly]);

  const handleModeChange = (nextMode: 'route' | 'lines') => {
    setMode(nextMode);
    if (nextMode === 'route') {
      if (startStop && endStop) {
        navigate(`/directions/${startStop.bus_stop_id}/${endStop.bus_stop_id}`);
      } else {
        navigate('/');
      }
      return;
    }

    const firstSelected = Array.from(selectedServices.values())[0];
    navigate(firstSelected ? `/bus/${firstSelected}` : '/bus');
  };

  const mapArea = <div className="map-shell">Map integration in progress...</div>;

  const topSearch = (
    <div className="search-island-shell">
      <input
        className="search-island-input"
        placeholder="Search bus stop (EN/MM)"
        aria-label="Global Search"
      />
      <kbd className="search-island-kbd">CMD+K</kbd>
    </div>
  );

  const leftPanel = (
    <div className="panel-shell">
      <div className="mode-toggle">
        <button
          type="button"
          className={mode === 'route' ? 'active' : ''}
          onClick={() => handleModeChange('route')}
        >
          Route
        </button>
        <button
          type="button"
          className={mode === 'lines' ? 'active' : ''}
          onClick={() => handleModeChange('lines')}
        >
          Lines
        </button>
      </div>

      {mode === 'route' ? (
        <div>
          <h2>Route Planner</h2>
          <p>{isCalculating ? 'Calculating route...' : 'Pick two stops to calculate journey.'}</p>
          <p>Loaded stops: {uniqueStops.length.toLocaleString()}</p>
          <p>
            Start: {startStop ? `${startStop.name_en} (${startStop.bus_stop_id})` : 'Not selected'}
          </p>
          <p>
            End: {endStop ? `${endStop.name_en} (${endStop.bus_stop_id})` : 'Not selected'}
          </p>
          <p>Segments: {routePath?.path.length ?? 0}</p>
        </div>
      ) : (
        <div>
          <h2>Bus Lines</h2>
          <p>Selected services: {selectedServices.size}</p>
        </div>
      )}
    </div>
  );

  const controls = (
    <div className="controls-shell">
      <button type="button" onClick={toggleTheme}>
        Toggle Theme ({preference})
      </button>
      <button type="button" onClick={() => setPreference('system')}>
        Use System
      </button>
    </div>
  );

  return <AppLayout mapArea={mapArea} topSearch={topSearch} leftPanel={leftPanel} controls={controls} />;
}
