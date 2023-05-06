import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {positionService} from "../../service/position.service";
import {listTranslations} from "../../interface/translations";
import {LocationService} from "../../service/http/location.service";
import {LocationEntity} from "../../interface/LocationEntity";
import {WaypointsEntity} from "../../interface/WaypointsEntity";
import {WaypointService} from "../../service/http/waypoint.service"
import {cookieService} from "../../service/cookie.service";
import {UserService} from "../../service/http/user.service";
import {WaypointVisitedService} from "../../service/http/waypointVisited.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnChanges {
  percentage: number = 0;
  username: string = '';
  locationParams: string | undefined
  locations: LocationEntity[] | undefined;
  location: LocationEntity | undefined;

  waypoints: WaypointsEntity[] | undefined;

  positionCord: any;

  isNear: boolean = true;


  translations: listTranslations = {} as listTranslations

  positionNotFound: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private positionService: positionService,
    private locationService: LocationService,
    private waypointService: WaypointService,
    private waypointVisitedService: WaypointVisitedService,
    private userService: UserService,
    private cookieService: cookieService,
  ) {
  }

  async ngOnInit() {
    this.username = this.cookieService.getUsername();
    this.route.params.subscribe(params => {
      this.locationParams = params['location'];
    });
    this.locationService.getLocation(this.locationParams ?? "").subscribe(location => {
      this.location = location;
      if (this.location.location != null || this.location.location != undefined) {
        this.isNear = false;
        this.waypointService.getWaypoints(this.location.location).subscribe(waypoints => {
          this.waypoints = waypoints;
          console.log("waypoints", this.waypoints);
          this.setDistance();
          //this.setVisited();
        });
      }

    });
    this.locationService.getLocations().subscribe(locations => {
      this.locations = locations;
      console.log("locations", this.locations)
      this.setDistance()
    });
    this.getPosition();
    this.positionNotFoundFunction();

  }


  positionNotFoundFunction() {
    if (!this.positionNotFound) {
      setTimeout(() => {
        if (!this.positionCord) {
          this.positionNotFound = true;
        }
      }, 5000);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['positionCord'] && (changes['positionCord'])) {
      console.log("onChanges")
      this.setDistance();
    }
  }

  getPosition(): any {
    setInterval(async () => {
      this.positionCord = await this.positionService.getLocation();
      this.setDistance();
    }, 2000);
  }

  private checkDataPopulated(): void {
    if (this.locations && this.location) {
      console.log("Dati popolati correttamente:", this.locations, this.location);
      for (let i = 0; i < this.locations.length; i++) {
        if (this.locations[i].location === this.locationParams) {
          this.location = this.locations[i];
          console.log("Location trovata:", this.location);
          this.isNear = false;
          this.setDistance();
          break;
        }
      }
    }
  }

  private setDistance(): void {
    if (this.waypoints) {
      for (let i = 0; i < this.waypoints.length; i++) {
        this.waypoints[i].distance = this.positionService.getDistanceBetweenCoordinates(this.waypoints[i].lat, this.waypoints[i].lon, this.positionCord.lat, this.positionCord.lon);
      }
    } else {
      if (this.locations) {
        for (let i = 0; i < this.locations.length; i++) {
          this.locations[i].distance = this.positionService.getDistanceBetweenCoordinates(this.locations[i].lat, this.locations[i].lon, this.positionCord.lat, this.positionCord.lon);
        }
      }
    }
  }
/*
  private setVisited(): void {
    if (this.username && this.waypoints) {
      for (let i = 0; i < this.waypoints.length; i++) {
        if (this.waypoints[i].id !== undefined) {
          this.waypoints[i].visited == this.waypointVisitedService.getWaypointByUserAndWaypoint(this.username, this.waypoints[i].id);
        }
      }
    }
  }
*/
  /*
    private setVisited(): void {
      this.userService.getUser(this.username).subscribe((user: any) => {
        if (this.waypoints && user.id) {
          let userid: string = user.id.toString();
          for (let i = 0; i < this.waypoints.length; i++) {
            let waypoint: number;
            if (this.waypoints[i].id!==undefined) {
              waypoint = this.waypoints[i].id;
            } else {
              waypoint = 0;
            }
            this.waypointVisitedService.getWaypointByUserAndWaypoint(userid, waypoint).subscribe((waypointVisited: any) => {
              if (waypointVisited) {
                this.waypoints[i].visited = true;
                this.setPercentage();
              }
            });
          }
        }
      });
    }

  */

  setPercentage()
    :
    void {
    this.percentage = this.waypoints?.length ?? 0;
  }
}
