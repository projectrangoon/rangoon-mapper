export type ServiceNumber = number;

export interface BusServiceRef {
  color: string;
  service_name: ServiceNumber;
  sequence: number;
}

export interface BusStop {
  bus_stop_id: number;
  lat: number;
  lng: number;
  name_en: string;
  name_mm: string;
  road_en: string;
  road_mm: string;
  township_en: string;
  township_mm: string;
  services: BusServiceRef[];
}

export interface UniqueStop {
  bus_stop_id: number;
  lat: number;
  lng: number;
  name_en: string;
  name_mm: string;
  road_en: string;
  road_mm: string;
  township_en: string;
  township_mm: string;
  services: BusServiceRef[];
}

export interface AdjacencyNode {
  bus_stop_id: number;
  lat: number;
  lng: number;
  name_en: string;
  name_mm: string;
  road_en: string;
  road_mm: string;
  township_en: string;
  township_mm: string;
  service_name: ServiceNumber;
  color: string;
  sequence: number;
  distance: number;
}

export interface RouteShapePoint {
  lat: number;
  lng: number;
}

export interface BusService {
  color: string;
  service_name: string;
  service_no: number;
  stops: AdjacencyNode[];
  shape?: RouteShapePoint[];
}

export type BusStopsMap = Record<number, BusStop>;
export type BusServicesMap = Record<string, BusService>;
export type AdjacencyList = Record<string, AdjacencyNode[]>;

export interface RouteStep {
  bus_stop_id: number;
  service_name: ServiceNumber;
  distance?: number;
  walk?: boolean;
  lat?: number;
  lng?: number;
  name_en?: string;
  name_mm?: string;
  road_en?: string;
  road_mm?: string;
  township_en?: string;
  township_mm?: string;
  color?: string;
}

export interface RoutePath {
  currCost: number;
  currDistance: number;
  currTransfers: number;
  path: RouteStep[];
}

export type AppMode = 'route' | 'lines';
