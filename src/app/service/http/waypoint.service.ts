import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {newWaypoint, WaypointsEntity} from "../../interface/WaypointsEntity";
import {catchError, throwError} from "rxjs";

const BASE_URL = "progetto152";
const WAYPOINT = BASE_URL + "/waypoint";
const GET_WAYPOINT_BY_ID = WAYPOINT + "id/";


@Injectable({
  providedIn: 'root',
})

export class WaypointService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getAllWaypoints() {
    return this.http.get<WaypointsEntity[]>(WAYPOINT);
  }

  getWaypoints(location: string) {
    return this.http.get<WaypointsEntity[]>(WAYPOINT + "/" + location)

  }

  getWaypoint(location: string, id: number) {
    return this.http.get<WaypointsEntity>(WAYPOINT + "/" + location + "/" + id);
  }

  getWaypointById(id: number) {
    return this.http.get<WaypointsEntity>(GET_WAYPOINT_BY_ID + id);
  }

  createWaypoint(waypoint: newWaypoint) {
    return this.http.post<WaypointsEntity>(WAYPOINT, waypoint);
  }

  updateWaypoint(waypoint: WaypointsEntity, id: number) {
    return this.http.put<WaypointsEntity>(WAYPOINT + "/" + id, waypoint);
  }

  deleteWaypoint(id: number) {
    return this.http.delete<WaypointsEntity>(WAYPOINT+"/" + id);
  }
}
