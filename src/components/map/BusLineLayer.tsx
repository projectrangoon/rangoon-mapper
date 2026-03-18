import { along, length as turfLength, lineString } from '@turf/turf';
import type { Feature, LineString } from 'geojson';
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Layer, Marker, Source } from 'react-map-gl/maplibre';

import type { BusServicesMap } from '@/types';

interface BusLineLayerProps {
  busServices: BusServicesMap;
  selectedServices: Set<string>;
}

interface ServicePath {
  id: string;
  color: string;
  line: Feature<LineString>;
  distance: number;
}

const FLOW_LOOP_MS = 12000;
const FLOW_LOOKAHEAD = 0.01;

const getFlowHeading = (
  current: [number, number],
  next: [number, number],
): number => {
  const [currentLng, currentLat] = current;
  const [nextLng, nextLat] = next;
  return (Math.atan2(nextLat - currentLat, nextLng - currentLng) * 180) / Math.PI;
};

const buildServicePath = (id: string, busServices: BusServicesMap): ServicePath | null => {
  const service = busServices[id];
  if (!service || service.stops.length < 2) {
    return null;
  }

  const coordinates = service.stops.map((stop) => [stop.lng, stop.lat] as [number, number]);
  const line = lineString(coordinates);

  return {
    id,
    color: service.color,
    line,
    distance: turfLength(line, { units: 'kilometers' }),
  };
};

export default function BusLineLayer({ busServices, selectedServices }: BusLineLayerProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const startedAt = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      setProgress((elapsed % FLOW_LOOP_MS) / FLOW_LOOP_MS);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const servicePaths = useMemo(() => {
    return Array.from(selectedServices)
      .map((serviceId) => buildServicePath(serviceId, busServices))
      .filter((path): path is ServicePath => path !== null);
  }, [selectedServices, busServices]);

  if (servicePaths.length === 0) {
    return null;
  }

  return (
    <>
      {servicePaths.map((path, index) => {
        const phase = (progress + index * 0.21) % 1;
        const nextPhase = (phase + FLOW_LOOKAHEAD) % 1;
        const point = along(path.line, path.distance * phase, { units: 'kilometers' });
        const nextPoint = along(path.line, path.distance * nextPhase, { units: 'kilometers' });
        const [lng, lat] = point.geometry.coordinates;
        const [nextLng, nextLat] = nextPoint.geometry.coordinates;
        if (
          typeof lng !== 'number' ||
          typeof lat !== 'number' ||
          typeof nextLng !== 'number' ||
          typeof nextLat !== 'number'
        ) {
          return null;
        }

        const heading = getFlowHeading([lng, lat], [nextLng, nextLat]);

        return (
          <div key={path.id}>
            <Source id={`bus-source-${path.id}`} type="geojson" data={path.line}>
              <Layer
                id={`bus-layer-${path.id}`}
                type="line"
                paint={{
                  'line-color': path.color,
                  'line-width': 3,
                  'line-opacity': 0.8,
                }}
              />
            </Source>
            <Marker longitude={lng} latitude={lat} anchor="center">
              <div
                className="bus-flow-marker"
                style={{
                  '--flow-color': path.color,
                  '--flow-rotation': `${heading}deg`,
                } as CSSProperties}
              >
                <span className="bus-flow-pulse" />
                <span className="bus-flow-trail" />
                <span className="bus-flow-core" />
              </div>
            </Marker>
          </div>
        );
      })}
    </>
  );
}
