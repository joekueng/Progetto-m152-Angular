import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {LocationEntity} from "../../interface/LocationEntity";
import {WaypointsEntity} from "../../interface/WaypointsEntity";

const BASE_URL = "progetto152";
const WAYPOINT_VISITED = BASE_URL + "/waypoint/visited/";
const GET_WAYPOINT_BY_USER = WAYPOINT_VISITED + "USER/";


@Injectable({
  providedIn: 'root',
})

export class WaypointVisitedService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getWaypoints() {
    return this.http.get<WaypointsEntity[]>(WAYPOINT_VISITED);
  }

  getwaypointVisited(id: number) {
    return this.http.get<WaypointsEntity>(WAYPOINT_VISITED + id);
  }

  getWaypointByUser(user: string) {
    return this.http.get<WaypointsEntity[]>(GET_WAYPOINT_BY_USER + user);
  }

  createWaypoint(waypoint: WaypointsEntity) {
    return this.http.post<WaypointsEntity>(WAYPOINT_VISITED, waypoint);
  }

  updateWaypoint(waypoint: WaypointsEntity, id: number) {
    return this.http.put<WaypointsEntity>(WAYPOINT_VISITED + id, waypoint);
  }

  deleteWaypoint(id: number) {
    return this.http.delete<WaypointsEntity>(WAYPOINT_VISITED + id);
  }
}
