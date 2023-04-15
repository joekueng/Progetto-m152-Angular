import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Locations, waypoint} from "../interface/data";
import {BehaviorSubject, map, Observable, tap} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ReadjsonService{
  private locations: BehaviorSubject<Locations[]> = new BehaviorSubject<Locations[]>([]);

  constructor(private http: HttpClient) {
    this.http.get<Locations[]>('assets/data.json').subscribe(data => {
      this.locations.next(data)
      console.log("data loaded", data)
    });
  }
  getLocations(): Observable<Partial<Locations>[]> {
    return this.locations.pipe(
      map((locations) => {
        return locations.map((loc: Locations) => ({
          location: loc.location,
          region: loc.region,
          lat: loc.lat,
          lon: loc.lon
        }))
      }),
      tap(data => console.log("data requested", data)))
  }

  getLocation(location: string): Observable<Locations> {
    return this.locations.pipe(
      map((locations) => {
        const foundLocation: Locations | undefined = locations.find((loc: Locations) => loc.location === location);
        return foundLocation ? foundLocation : {location: '', region: '', lat: 0, lon: 0, waypoints: []};
      }),
      tap(data => console.log("data requested", data))
    );
  }


  getWaypoints(location: string, id: number): Observable<waypoint[]> {
    return this.locations.pipe(
      map((locations) => {
        const foundLocation: Locations | undefined = locations.find((loc: Locations) => loc.location === location);
        if (foundLocation?.waypoints) {
          return foundLocation ? foundLocation.waypoints.filter((way: waypoint) => way.id === id) : [];
        } else {
          return [];
        }
      }),
      tap(data => console.log("data requested", data))
    );
  }




}
