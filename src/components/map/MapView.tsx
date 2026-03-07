import { useMemo, useRef } from 'react';
import Map, { NavigationControl, ScaleControl, type MapRef } from 'react-map-gl/maplibre';

import BusLineLayer from '@/components/map/BusLineLayer';
import RouteLayer from '@/components/map/RouteLayer';
import RouteStopMarkers from '@/components/map/RouteStopMarkers';
import StopMarker from '@/components/map/StopMarker';
import type { BusServicesMap, BusStop, RoutePath } from '@/types';

interface MapViewProps {
  theme: 'dark' | 'light';
  center: { lat: number; lng: number };
  zoom: number;
  routePath: RoutePath | null;
  startStop: BusStop | null;
  endStop: BusStop | null;
  busServices: BusServicesMap;
  selectedServices: Set<string>;
  onMove: (center: { lat: number; lng: number }, zoom: number) => void;
  onReady: (map: MapRef | null) => void;
}

const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export default function MapView({
  theme,
  center,
  zoom,
  routePath,
  startStop,
  endStop,
  busServices,
  selectedServices,
  onMove,
  onReady,
}: MapViewProps) {
  const mapRef = useRef<MapRef | null>(null);

  const mapStyle = useMemo(() => (theme === 'dark' ? DARK_STYLE : LIGHT_STYLE), [theme]);

  return (
    <Map
      ref={(instance) => {
        mapRef.current = instance;
        onReady(instance);
      }}
      style={{ width: '100%', height: '100%' }}
      initialViewState={{ longitude: center.lng, latitude: center.lat, zoom }}
      mapStyle={mapStyle}
      reuseMaps
      attributionControl={false}
      onMoveEnd={(event) => {
        onMove(
          { lat: event.viewState.latitude, lng: event.viewState.longitude },
          event.viewState.zoom,
        );
      }}
    >
      <ScaleControl position="bottom-left" />
      <NavigationControl position="bottom-right" />

      <RouteLayer routePath={routePath} startStop={startStop} endStop={endStop} busServices={busServices} />
      <RouteStopMarkers routePath={routePath} startStop={startStop} endStop={endStop} zoom={zoom} />
      <BusLineLayer busServices={busServices} selectedServices={selectedServices} />

      {startStop && <StopMarker lat={startStop.lat} lng={startStop.lng} label={startStop.name_en} color="#245dff" variant="start" />}
      {endStop && <StopMarker lat={endStop.lat} lng={endStop.lng} label={endStop.name_en} color="#161616" variant="end" />}
    </Map>
  );
}
