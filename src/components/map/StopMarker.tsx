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
        aria-label={`${variant === 'start' ? 'Start' : 'Destination'}: ${label}`}
      >
        <div className={`stop-marker-label stop-marker-label-${variant}`}>
          <span className="stop-marker-chip stop-marker-chip-name">{label}</span>
        </div>
        <span className="stop-marker-pin" />
      </div>
    </Marker>
  );
}
