import { Marker } from 'react-map-gl/maplibre';
import type { CSSProperties } from 'react';

import type { AppLocale } from '@/types';

interface StopMarkerProps {
  lat: number;
  lng: number;
  label: string;
  color: string;
  locale: AppLocale;
  variant: 'start' | 'end';
}

export default function StopMarker({ lat, lng, label, color, locale, variant }: StopMarkerProps) {
  const markerLabel =
    locale === 'my'
      ? variant === 'start'
        ? 'စမှတ်'
        : 'ပန်းတိုင်'
      : variant === 'start'
        ? 'Start'
        : 'End';

  return (
    <Marker latitude={lat} longitude={lng} anchor="center">
      <div
        className={`stop-marker stop-marker-${variant}`}
        style={{ '--marker-color': color } as CSSProperties}
        title={label}
        aria-label={`${markerLabel}: ${label}`}
      >
        <div className={`stop-marker-label stop-marker-label-${variant}`}>
          <span className="stop-marker-chip">
            <small>{markerLabel}</small>
            <strong className="stop-marker-chip-name">{label}</strong>
          </span>
        </div>
        <span className="stop-marker-pin" />
      </div>
    </Marker>
  );
}
