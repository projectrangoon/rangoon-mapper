import { Marker } from 'react-map-gl/maplibre';
import type { CSSProperties } from 'react';

interface StopMarkerProps {
  lat: number;
  lng: number;
  label: string;
  color: string;
}

export default function StopMarker({ lat, lng, label, color }: StopMarkerProps) {
  return (
    <Marker latitude={lat} longitude={lng} anchor="center">
      <div className="stop-marker" style={{ '--marker-color': color } as CSSProperties} title={label}>
        <span />
      </div>
    </Marker>
  );
}
