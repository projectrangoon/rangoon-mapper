import { Marker } from 'react-map-gl/maplibre';
import type { CSSProperties } from 'react';

interface StopMarkerProps {
  lat: number;
  lng: number;
  label: string;
  color: string;
  variant: 'start' | 'end';
}

export default function StopMarker({ lat, lng, label, color, variant }: StopMarkerProps) {
  return (
    <Marker latitude={lat} longitude={lng} anchor="center">
      <div
        className={`stop-marker stop-marker-${variant}`}
        style={{ '--marker-color': color } as CSSProperties}
        title={label}
      >
        <div className="stop-marker-bubble">
          <small>{variant === 'start' ? 'Start' : 'Destination'}</small>
          <strong>{label}</strong>
        </div>
        <span />
      </div>
    </Marker>
  );
}
