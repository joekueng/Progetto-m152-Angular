import {Component, OnInit} from '@angular/core';
import {UserEntity} from "../../interface/UserEntity";
import {LocationEntity} from "../../interface/LocationEntity";
import {WaypointsEntity} from "../../interface/WaypointsEntity";
import {ActivatedRoute} from "@angular/router";
import {LocationService} from "../../service/http/location.service";
import {UserService} from "../../service/http/user.service";
import {WaypointService} from "../../service/http/waypoint.service";
import {toNumbers} from "@angular/compiler-cli/src/version_helpers";

@Component({
  selector: 'app-home',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})

export class ManagementComponent implements OnInit {
  showUserForm: boolean = false;
  showLocationForm: boolean = false;
  showWaypointForm: boolean = false;

  newUser: UserEntity = {name: "", password: "", username: ""};
  newLocation: LocationEntity = {lat: 0, location: "", lon: 0, region: ""};
  newWaypoint: WaypointsEntity = {description: "", img: "", lat: 0, locationName: "", lon: 0, name: ""};

  locations: LocationEntity[] | undefined;
  waypoints: WaypointsEntity[] | undefined;
  users: UserEntity[] | undefined;


  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService,
    private waypointService: WaypointService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
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

  addUser(name: string, username: string, password: string) {
    this.newUser = { name: name, username: username, password: password};
    this.userService.createUser(this.newUser).subscribe(user => {
      this.users?.push(user);
    });
    this.showUserForm = false;
  }

  addLocation(name: string, region: string, lat: number, lon: number) {
    this.newLocation = {location: name, region: region, lat: lat, lon: lon};
    this.locationService.createLocation(this.newLocation).subscribe(location => {
      this.locations?.push(location);
    });
    this.showLocationForm = false;
  }

  addWaypoint(name: string, lat: number, lon: number, description: string, image: string, locationName: string) {
    this.newWaypoint = {description: description, img: image, lat: lat, locationName: locationName, lon: lon, name: name}
    this.waypointService.createWaypoint(this.newWaypoint).subscribe(waypoint => {
      this.waypoints?.push(waypoint);
    });
    this.showWaypointForm = false;
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

  protected readonly String = String;
}
