import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { MapRef } from 'react-map-gl/maplibre';

import BusLinesPanel from '@/components/bus/BusLinesPanel';
import AppLayout from '@/components/layout/AppLayout';
import ControlCluster from '@/components/layout/ControlCluster';
import ModeToggle from '@/components/layout/ModeToggle';
import MapView from '@/components/map/MapView';
import RoutePanel from '@/components/route/RoutePanel';
import HalftoneOverlay from '@/components/ui/HalftoneOverlay';
import SearchIsland from '@/components/ui/SearchIsland';
import { useLocale } from '@/hooks/useLocale';
import { useSearch } from '@/hooks/useSearch';
import { useRouteCalculation } from '@/hooks/useRouteCalculation';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/stores/useAppStore';
import { useBusStore } from '@/stores/useBusStore';
import { useMapStore } from '@/stores/useMapStore';
import type { AppMode, UniqueStop } from '@/types';

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

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<MapRef | null>(null);

  const mode = useAppStore((state) => state.mode);
  const panelOpen = useAppStore((state) => state.panelOpen);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setMode = useAppStore((state) => state.setMode);
  const setPanelOpen = useAppStore((state) => state.setPanelOpen);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  const center = useMapStore((state) => state.center);
  const zoom = useMapStore((state) => state.zoom);
  const routePath = useMapStore((state) => state.routePath);
  const startStop = useMapStore((state) => state.startStop);
  const endStop = useMapStore((state) => state.endStop);
  const uniqueStops = useMapStore((state) => state.uniqueStops);
  const busServices = useMapStore((state) => state.busServices);
  const isDataReady = useMapStore((state) => state.isDataReady);
  const setViewport = useMapStore((state) => state.setViewport);
  const setStartStop = useMapStore((state) => state.setStartStop);
  const setEndStop = useMapStore((state) => state.setEndStop);
  const clearRoute = useMapStore((state) => state.clearRoute);
  const getStopById = useMapStore((state) => state.getStopById);

  const selectedServices = useBusStore((state) => state.selectedServices);
  const expandedService = useBusStore((state) => state.expandedService);
  const toggleService = useBusStore((state) => state.toggleService);
  const setExpandedService = useBusStore((state) => state.setExpandedService);
  const selectOnly = useBusStore((state) => state.selectOnly);
  const clearServices = useBusStore((state) => state.clearServices);

  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLocale } = useLocale();
  const { isCalculating } = useRouteCalculation();

  const selectedServicesKey = useMemo(
    () => Array.from(selectedServices).sort((a, b) => Number(a) - Number(b)).join(','),
    [selectedServices],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!isDataReady) {
      return;
    }

    if (location.pathname.startsWith('/bus')) {
      setMode('lines');
      if (serviceName) {
        selectOnly(serviceName);
      }
      return;
    }

    setMode('route');
    clearServices();
    setExpandedService(null);
    const startId = parseStopId(startStopParam);
    const endId = parseStopId(endStopParam);

    if (!startId || !endId) {
      return;
    }

    const deepStart = getStopById(startId);
    const deepEnd = getStopById(endId);

    if (deepStart) {
      setStartStop(deepStart);
    }

    if (deepEnd) {
      setEndStop(deepEnd);
    }
  }, [
    location.pathname,
    serviceName,
    startStopParam,
    endStopParam,
    getStopById,
    setMode,
    setStartStop,
    setEndStop,
    selectOnly,
    clearServices,
    setExpandedService,
    isDataReady,
  ]);

  useEffect(() => {
    if (!isDataReady) {
      return;
    }

    if (mode === 'route') {
      if (startStop && endStop) {
        const target = `/directions/${startStop.bus_stop_id}/${endStop.bus_stop_id}`;
        if (location.pathname !== target) {
          navigate(target, { replace: true });
        }
        return;
      }

      if (location.pathname.startsWith('/directions/')) {
        navigate('/', { replace: true });
      }
      return;
    }

    const firstService = selectedServicesKey.split(',').find(Boolean);
    const target = firstService ? `/bus/${firstService}` : '/bus';
    if (location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [
    mode,
    startStop,
    endStop,
    selectedServicesKey,
    location.pathname,
    navigate,
    isDataReady,
  ]);

  const { results: searchResults } = useSearch(uniqueStops, searchQuery, 180);

  const handleModeChange = (nextMode: AppMode) => {
    setMode(nextMode);
    if (nextMode === 'route') {
      clearServices();
      setExpandedService(null);
    }
  };

  const applySearchSelection = (stop: UniqueStop) => {
    if (mode === 'lines') {
      clearServices();
      setExpandedService(null);
      setMode('route');
      setStartStop(stop);
      setEndStop(null);
      setSearchQuery('');
      return;
    }

    if (!startStop || (startStop && endStop)) {
      setStartStop(stop);
      setEndStop(null);
      setSearchQuery('');
      return;
    }

    setEndStop(stop);
    setSearchQuery('');
  };

  const topSearch = (
    <SearchIsland
      ref={searchInputRef}
      locale={locale}
      query={searchQuery}
      results={searchResults}
      onQueryChange={setSearchQuery}
      onSelect={applySearchSelection}
    />
  );

  const panelBody =
    mode === 'route' ? (
      <RoutePanel
        locale={locale}
        uniqueStops={uniqueStops}
        startStop={startStop}
        endStop={endStop}
        routePath={routePath}
        isCalculating={isCalculating}
        onSelectStart={(stop) => {
          setStartStop(stop);
          if (!stop) {
            clearRoute();
          }
        }}
        onSelectEnd={(stop) => {
          setEndStop(stop);
          if (!stop) {
            clearRoute();
          }
        }}
        onSwapStops={() => {
          if (!startStop || !endStop) {
            return;
          }

          setStartStop(endStop);
          setEndStop(startStop);
        }}
      />
    ) : (
      <BusLinesPanel
        locale={locale}
        busServices={busServices ?? {}}
        selectedServices={selectedServices}
        expandedService={expandedService}
        onToggleService={toggleService}
        onExpandService={setExpandedService}
      />
    );

  const leftPanel = (
    <AnimatePresence initial={false}>
      {panelOpen && (
        <motion.div
          className="panel-stack"
          initial={{ x: -16, y: 10, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={{ x: -16, y: 10, opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          <ModeToggle mode={mode} onChange={handleModeChange} />
          {panelBody}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const mapArea = (
    <>
      <MapView
        locale={locale}
        theme={theme}
        center={center}
        zoom={zoom}
        routePath={mode === 'route' ? routePath : null}
        startStop={mode === 'route' ? startStop : null}
        endStop={mode === 'route' ? endStop : null}
        busServices={busServices ?? {}}
        focusedServiceId={mode === 'lines' ? expandedService ?? (selectedServices.size === 1 ? Array.from(selectedServices)[0] ?? null : null) : null}
        selectedServices={selectedServices}
        onMove={setViewport}
        onReady={(instance) => {
          mapRef.current = instance;
        }}
      />
      <HalftoneOverlay />
    </>
  );

  const controls = (
    <ControlCluster
      locale={locale}
      theme={theme}
      panelOpen={panelOpen}
      onToggleLocale={toggleLocale}
      onToggleTheme={toggleTheme}
      onTogglePanel={() => setPanelOpen(!panelOpen)}
      onResetBearing={() => mapRef.current?.easeTo({ bearing: 0, pitch: 0, duration: 500 })}
      onResetView={() => mapRef.current?.flyTo({ center: [96.1518985, 16.7943528], zoom: 13, duration: 1200 })}
    />
  );

  return <AppLayout mapArea={mapArea} topSearch={topSearch} leftPanel={leftPanel} controls={controls} />;
}
