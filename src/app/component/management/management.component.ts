import {Component, OnInit} from '@angular/core';
import {newUser, UserEntity} from "../../interface/UserEntity";
import {LocationEntity} from "../../interface/LocationEntity";
import {newWaypoint, WaypointsEntity} from "../../interface/WaypointsEntity";
import {Router} from "@angular/router";
import {LocationService} from "../../service/http/location.service";
import {UserService} from "../../service/http/user.service";
import {WaypointService} from "../../service/http/waypoint.service";
import {managementTranslations} from "../../interface/translations";
import {TranslateService} from "../../service/language/translate.service";
import {ReadTranslateJsonService} from "../../service/language/readTranslateJson.service";
import {cookieService} from "../../service/cookie.service";

@Component({
  selector: 'app-home',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})

export class ManagementComponent implements OnInit {

  username: string = '';
  showUserForm: boolean = false;
  showLocationForm: boolean = false;
  showWaypointForm: boolean = false;

  newUser: newUser = {password: "", username: ""};
  newLocation: LocationEntity = {location: "", lat: 0, lon: 0, region: ""};
  newWaypoint: newWaypoint = {description: "", img: "", lat: 0, locationName: "", lon: 0, name: ""};

  locations: LocationEntity[] | undefined;
  waypoints: WaypointsEntity[] | undefined;
  users: UserEntity[] | undefined;

  translations: managementTranslations = {} as managementTranslations

  constructor(
    private route: Router,
    private locationService: LocationService,
    private waypointService: WaypointService,
    private userService: UserService,
    private translateService: TranslateService,
    private readTranslationJsonService: ReadTranslateJsonService,
    private cookieService: cookieService,
  ) {
  }

  ngOnInit(): void {
    this.translations = this.readTranslationJsonService.getManagementTranslations();
    this.username = this.cookieService.getUsername();
    this.userService.getUser(this.username).subscribe(user => {
      if (user !== null) {
        if (user.admin == false) {
          this.route.navigate(['/home']);
        }
      } else {
        this.cookieService.deleteUsername();
        this.route.navigate(['/login']);
      }

    });
    this.locationService.getLocations().subscribe(locations => {
      this.locations = locations;
    });
    this.waypointService.getAllWaypoints().subscribe(waypoints => {
      this.waypoints = waypoints;
    });
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  addUser(username: string, password: string) {
    this.newUser = {username: username, password: password};
    this.userService.createUser(this.newUser).subscribe(user => {
      this.users?.push(user);
    });
    this.showUserForm = false;
  }

  addLocation(name: string, region: string, lat: number, lon: number) {
    this.newLocation = {location: name, region: region, lat: lat, lon: lon};
    console.log("newLocation")
    console.log(this.newLocation);
    this.locationService.createLocation(this.newLocation).subscribe(location => {
      this.locations?.push(location);
    });
    this.showLocationForm = false;
  }

  addWaypoint(name: string, lat: number, lon: number, description: string, image: string, locationName: string) {
    this.newWaypoint = {
      description: description,
      img: image,
      lat: lat,
      locationName: locationName,
      lon: lon,
      name: name
    }
    this.waypointService.createWaypoint(this.newWaypoint).subscribe(waypoint => {
      this.waypoints?.push(waypoint);
    });
    this.showWaypointForm = false;
  }

  deleteLocation(location: string) {
    this.locationService.deleteLocation(location).subscribe(location => {
      this.locations?.splice(this.locations?.indexOf(location), 1);
    });
  }

  deleteWaypoint(id: number) {
    this.waypointService.deleteWaypoint(id).subscribe(waypoint => {
      this.waypoints?.splice(this.waypoints?.indexOf(waypoint), 1);
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(user => {
      this.users?.splice(this.users?.indexOf(user), 1);
    });
  }

  editLocation(location: LocationEntity) {
    this.locationService.updateLocation(location).subscribe(location => {
      this.locations?.splice(this.locations?.indexOf(location), 1, location);
    });
  }

  editWaypoint(waypoint: WaypointsEntity) {
    this.waypointService.updateWaypoint(waypoint, waypoint.id).subscribe(waypoint => {
      this.waypoints?.splice(this.waypoints?.indexOf(waypoint), 1, waypoint);
    });
  }

  editUser(user: UserEntity) {
    this.userService.updateUser(user, user.id).subscribe(user => {
      this.users?.splice(this.users?.indexOf(user), 1, user);
    });
  }

  openEditLocationForm(location: LocationEntity) {
    this.newLocation = location;
    this.showLocationForm = true;
  }

  openEditWaypointForm(waypoint: WaypointsEntity) {
    this.newWaypoint = waypoint;
    this.showWaypointForm = true;
  }

  openEditUserForm(user: UserEntity) {
    this.newUser = user;
    this.showUserForm = true;
  }

  openUserForm() {
    this.showUserForm = true;
  }

  closeUserForm() {
    this.showUserForm = false;
  }

  openLocationForm() {
    this.showLocationForm = true;
  }

  closeLocationForm() {
    this.showLocationForm = false;
  }

  openWaypointForm() {
    this.showWaypointForm = true;
  }

  closeWaypointForm() {
    this.showWaypointForm = false;
  }
}
