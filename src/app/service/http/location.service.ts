import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {LocationEntity} from "../../interface/LocationEntity";

const BASE_URL = "progetto152";
const LOCATION = BASE_URL + "/location";


@Injectable({
  providedIn: 'root',
})

export class LocationService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getLocations() {
    return this.http.get<LocationEntity[]>(LOCATION);
  }

  getLocation(location: string) {
    return this.http.get<LocationEntity>(LOCATION + "/" + location);
  }

  createLocation(location: LocationEntity) {
    return this.http.post<LocationEntity>(LOCATION, location);
  }

  updateLocation(location: LocationEntity) {
    return this.http.put<LocationEntity>(LOCATION+"/"+location.location, location);
  }

  deleteLocation(location: string) {
    return this.http.delete<LocationEntity>(LOCATION +"/"+ location);
  }
}
