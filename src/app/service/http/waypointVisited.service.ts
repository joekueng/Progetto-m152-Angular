import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {WaypointsEntity} from "../../interface/WaypointsEntity";
import {WaypointsVisitedEntity} from "../../interface/WaypointsVisitedEntity";

const BASE_URL = "progetto152";
const WAYPOINT_VISITED = BASE_URL + "/waypoint/visited";
const GET_WAYPOINT_BY_USER = WAYPOINT_VISITED + "/USER/";


@Injectable({
  providedIn: 'root',
})

export class WaypointVisitedService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getWaypoints() {
    return this.http.get<WaypointsVisitedEntity[]>(WAYPOINT_VISITED);
  }

  getwaypointVisited(id: number) {
    return this.http.get<WaypointsVisitedEntity>(WAYPOINT_VISITED +"/"+ id);
  }

  getWaypointByUser(user: string) {
    return this.http.get<WaypointsVisitedEntity[]>(GET_WAYPOINT_BY_USER + user);
  }

  getWaypointByUserAndWaypoint(user: string, waypoint: number) {
    return this.http.get<boolean>(GET_WAYPOINT_BY_USER + user + "/" + waypoint);
  }

  createWaypoint(waypointvisited: WaypointsVisitedEntity) {
    return this.http.post<WaypointsVisitedEntity>(WAYPOINT_VISITED, waypointvisited);
  }

  updateWaypoint(waypoint: WaypointsVisitedEntity, id: number) {
    return this.http.put<WaypointsVisitedEntity>(WAYPOINT_VISITED +"/"+ id, waypoint);
  }

  deleteWaypoint(id: number) {
    return this.http.delete<WaypointsVisitedEntity>(WAYPOINT_VISITED + id);
  }
}
