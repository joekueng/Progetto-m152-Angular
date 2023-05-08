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
  edit: boolean = false;
  id: number = 0;

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
    // check if user is admin
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
    // get all locations, waypoints and users
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

  // show user form
  formUser(username: string, password: string) {
    if (this.edit) {
      const user: UserEntity = {id: this.id, username: username, password: password};
      this.editUser(user);
      this.edit = false;
    } else {
      this.addUser(username, password);
    }
  }

  // show location form
  formLocation(name: string, region: string, lat: number, lon: number) {
    if (this.edit) {
      const location: LocationEntity = {location: name, region: region, lat: lat, lon: lon};
      this.editLocation(location);
      this.edit = false;
    } else {
      this.addLocation(name, region, lat, lon);
    }
  }

  // show waypoint form
  formWaypoint(name: string, lat: number, lon: number, description: string, image: string, locationName: string) {
    if (this.edit) {
      const waypoint: WaypointsEntity = {
        id: this.id,
        name: name,
        lat: lat,
        lon: lon,
        description: description,
        img: image,
        locationName: locationName
      };
      this.editWaypoint(waypoint);
      this.edit = false;
    } else {
      this.addWaypoint(name, lat, lon, description, image, locationName);
    }
  }

  // add user to database
  addUser(username: string, password: string) {
    this.newUser = {username: username, password: password};
    this.userService.createUser(this.newUser).subscribe(user => {
      this.users?.push(user);
    });
    this.closeUserForm();
  }

  // add location to database
  addLocation(name: string, region: string, lat: number, lon: number) {
    this.newLocation = {location: name, region: region, lat: lat, lon: lon};
    console.log("newLocation")
    console.log(this.newLocation);
    this.locationService.createLocation(this.newLocation).subscribe(location => {
      this.locations?.push(location);
    });
    this.closeLocationForm()
  }

  // add waypoint to database
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
    this.closeWaypointForm();
  }

  // delete location from database
  deleteLocation(location: string) {
    this.locationService.deleteLocation(location).subscribe(location => {
      this.locations?.splice(this.locations?.indexOf(location), 1);
    });
  }

  // delete waypoint from database
  deleteWaypoint(id: number) {
    this.waypointService.deleteWaypoint(id).subscribe(waypoint => {
      this.waypoints?.splice(this.waypoints?.indexOf(waypoint), 1);
    });
  }

  // delete user from database
  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(user => {
      this.users?.splice(this.users?.indexOf(user), 1);
    });
  }

  // edit location in database
  editLocation(location: LocationEntity) {
    this.locationService.updateLocation(location).subscribe(location => {
      this.locations?.splice(this.locations?.indexOf(location), 1, location);
    });
    this.closeLocationForm()
  }

  // edit waypoint in database
  editWaypoint(waypoint: WaypointsEntity) {
    this.waypointService.updateWaypoint(waypoint, waypoint.id).subscribe(waypoint => {
      this.waypoints?.splice(this.waypoints?.indexOf(waypoint), 1, waypoint);
    });
    this.closeWaypointForm()
  }

  // edit user in database
  editUser(user: UserEntity) {
    this.userService.updateUser(user, user.id).subscribe(user => {
      this.users?.splice(this.users?.indexOf(user), 1, user);
    });
    this.closeUserForm()
  }


  // open edit location forms
  openEditLocationForm(location: LocationEntity) {
    this.newLocation = location;
    this.edit = true;
    this.showLocationForm = true;
  }

  // open edit waypoint forms
  openEditWaypointForm(waypoint: WaypointsEntity) {
    this.newWaypoint = waypoint;
    this.id = waypoint.id;
    this.edit = true;
    this.showWaypointForm = true;
  }

  // open edit user forms
  openEditUserForm(user: UserEntity) {
    this.newUser = user;
    this.id = user.id;
    this.edit = true;
    this.showUserForm = true;
  }

  // open user form
  openUserForm() {
    this.showUserForm = true;
  }

  // open waypoint form
  openWaypointForm() {
    this.showWaypointForm = true;
  }

  // open location form
  openLocationForm() {
    this.showLocationForm = true;
  }

  // close user forms
  closeUserForm() {
    this.showUserForm = false;
    this.newUser = {username: '', password: ''};
  }

  // close location forms
  closeLocationForm() {
    this.showLocationForm = false;
    this.newLocation = {location: '', region: '', lat: 0, lon: 0};
  }

  // close waypoint forms
  closeWaypointForm() {
    this.showWaypointForm = false;
    this.newWaypoint = {description: "", img: "", lat: 0, locationName: "", lon: 0, name: ""};
  }
}
