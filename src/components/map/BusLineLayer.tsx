import { along, length as turfLength, lineString } from '@turf/turf';
import type { Feature, LineString } from 'geojson';
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

    const tick = () => {
      setProgress((value) => {
        const next = value + 0.0016;
        if (next >= 1) {
          return 0;
        }
        return next;
      });
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
        const point = along(path.line, path.distance * phase, { units: 'kilometers' });
        const [lng, lat] = point.geometry.coordinates;
        if (typeof lng !== 'number' || typeof lat !== 'number') {
          return null;
        }

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
              <div className="bus-point" style={{ backgroundColor: path.color }} />
            </Marker>
          </div>
        );
      })}
    </>
  );
}
