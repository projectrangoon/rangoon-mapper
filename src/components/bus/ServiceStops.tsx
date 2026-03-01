import type { AdjacencyNode } from '@/types';

interface ServiceStopsProps {
  stops: AdjacencyNode[];
}

export default function ServiceStops({ stops }: ServiceStopsProps) {
  return (
    <ol className="service-stops">
      {stops.map((stop) => (
        <li key={`${stop.bus_stop_id}-${stop.sequence}`}>
          <span>{stop.sequence}.</span>
          <div>
            <strong>{stop.name_en}</strong>
            <small>{stop.name_mm}</small>
          </div>
        </li>
      ))}
    </ol>
  );
}
