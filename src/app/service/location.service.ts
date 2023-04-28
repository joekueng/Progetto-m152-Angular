import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {LocationEntity} from "../interface/LocationEntity";

const BASE_URL = "localhost:8080/progetto152/";
const GET_LOCATIONS = BASE_URL + "location";


@Injectable({
  providedIn: 'root',
})

export class LocationService {
  constructor(
    private http: HttpClient,
  ) {}

  getLocations(){
    return this.http.get<LocationEntity[]>("/progetto152/location");
  }



}
