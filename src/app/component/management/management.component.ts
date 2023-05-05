import {Component, OnInit} from '@angular/core';
import {UserEntity} from "../../interface/UserEntity";
import {LocationEntity} from "../../interface/LocationEntity";
import {WaypointsEntity} from "../../interface/WaypointsEntity";
import {ActivatedRoute} from "@angular/router";
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

  newUser: UserEntity = { password: "", username: ""};
  newLocation: LocationEntity = {location: "", lat: 0, lon: 0, region: ""};
  newWaypoint: WaypointsEntity = {description: "", img: "", lat: 0, locationName: "", lon: 0, name: ""};

  locations: LocationEntity[] | undefined;
  waypoints: WaypointsEntity[] | undefined;
  users: UserEntity[] | undefined;

  translations: managementTranslations = {} as managementTranslations

  constructor(
    private route: ActivatedRoute,
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

  addUser( username: string, password: string) {
    this.newUser = { username: username, password: password};
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

  async switchLanguage(lang: string) {

    // Man
    this.translations.users = await this.translateService.getData(this.translations.users, lang);
    this.translations.locations = await this.translateService.getData(this.translations.locations, lang);
    this.translations.waypoints = await this.translateService.getData(this.translations.waypoints, lang);
    this.translations.name = await this.translateService.getData(this.translations.name, lang);
    this.translations.username = await this.translateService.getData(this.translations.username, lang);
    this.translations.password = await this.translateService.getData(this.translations.password, lang);
    this.translations.location = await this.translateService.getData(this.translations.location, lang);
    this.translations.region = await this.translateService.getData(this.translations.region, lang);
    this.translations.lat = await this.translateService.getData(this.translations.lat, lang);
    this.translations.lon = await this.translateService.getData(this.translations.lon, lang);
    this.translations.description = await this.translateService.getData(this.translations.description, lang);
    this.translations.locationName = await this.translateService.getData(this.translations.locationName, lang);
    this.translations.image = await this.translateService.getData(this.translations.image, lang);
    this.translations.translate = await this.translateService.getData(this.translations.translate, lang);
    this.translations.addLocationButton = await this.translateService.getData(this.translations.addLocationButton, lang);
    this.translations.addUserButton = await this.translateService.getData(this.translations.addUserButton, lang);
    this.translations.addWaypointButton = await this.translateService.getData(this.translations.addWaypointButton, lang);
    this.translations.add = await this.translateService.getData(this.translations.add, lang);
    this.translations.close = await this.translateService.getData(this.translations.close, lang);
  }
}
