import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {positionService} from "../../service/position.service";
import {listTranslations} from "../../interface/translations";
import {LocationService} from "../../service/http/location.service";
import {LocationEntity} from "../../interface/LocationEntity";
import {WaypointsEntity} from "../../interface/WaypointsEntity";
import {WaypointService} from "../../service/http/waypoint.service"
import {cookieService} from "../../service/cookie.service";
import {UserService} from "../../service/http/user.service";
import {WaypointVisitedService} from "../../service/http/waypointVisited.service";
import {ReadTranslateJsonService} from "../../service/language/readTranslateJson.service";

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
    private readTranslationJsonService: ReadTranslateJsonService,
  ) {
  }

  async ngOnInit() {
    // get translations
    this.translations = this.readTranslationJsonService.getListTransaltions();
    // get username by cookie
    this.username = this.cookieService.getUsername();
    this.route.params.subscribe(params => {
      this.locationParams = params['location'];
    });
    // get location by locationParams
    this.locationService.getLocation(this.locationParams ?? "").subscribe(location => {
      this.location = location;
      if (this.location.location != null || this.location.location != undefined) {
        this.isNear = false;
        // get waypoints by location
        this.waypointService.getWaypoints(this.location.location).subscribe(waypoints => {
          this.waypoints = waypoints;
          console.log("waypoints", this.waypoints);
          this.setVisited();
          this.setDistance();
        });
      }
    });
    // get locations
    this.locationService.getLocations().subscribe(locations => {
      this.locations = locations;
      console.log("locations", this.locations)
      this.setDistance()
    });
    // get position of user
    this.getPosition();
    // set percentage of visited waypoints
    this.positionNotFoundFunction();
    // set distance between user and waypoints
    this.setDistance();
  }

  // set percentage of visited waypoints
  positionNotFoundFunction() {
    if (!this.positionNotFound) {
      setInterval(() => {
        if (!this.positionCord) {
          this.positionNotFound = true;
        }else {
          this.positionNotFound = false;
        }
      }, 5000);
    }
  }

  // check if positionCord is changed
  ngOnChanges(changes: SimpleChanges) {
    if (changes['positionCord'] && (changes['positionCord'])) {
      console.log("onChanges")
      this.setDistance();
    }
  }

  // get position of user
  getPosition(): any {
    setInterval(async () => {
      this.positionCord = await this.positionService.getLocation();
      this.setDistance();
    }, 2000);
  }

  // set distance between user and waypoints
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

  // set visited waypoints by user
  private setVisited(): void {
    console.log("setVisited")
    if (this.username && this.waypoints) {
      for (let i = 0; i < this.waypoints.length; i++) {
        if (this.waypoints[i].id) {
          this.waypointVisitedService.getWaypointByUserAndWaypoint(this.username, this.waypoints[i].id).subscribe((waypointVisited: any) => {
            if (this.waypoints) {
              this.waypoints[i].visited = waypointVisited;
              this.setPercentage();
            }
          });
        }
      }
    }
  }

  // set percentage of visited waypoints by user
  setPercentage(): void {
    if (this.waypoints) {
      let count: number = 0;
      for (let i = 0; i < this.waypoints.length; i++) {
        if (this.waypoints[i].visited) {
          count++;
        }
      }
      this.percentage = parseFloat((count / this.waypoints.length * 100).toFixed(0));
    }
  }
}
