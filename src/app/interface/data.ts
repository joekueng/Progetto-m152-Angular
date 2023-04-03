export interface Locations {
  location: string;
  region: string;
  lat: number;
  lon: number;
  waypoints?: waypoint[];
}

export interface waypoint {
  id: number;
  name: string;
  lat: number;
  lon: number;
  description: string;
  img: string;
}


