export interface WaypointsEntity {
  id?: number;
  name: string;
  lat: number;
  lon: number;
  description: string;
  img: string;
  locationName: string;
  distance?: number;
  visited?: boolean;
}
