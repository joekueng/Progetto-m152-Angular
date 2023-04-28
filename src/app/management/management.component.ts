import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

interface User {
  id: number;
  name: string;
  username: string;
  password: string;
}

interface Location {
  id: number;
  location: string;
  region: string;
  lat: string;
  lon: string;
}

interface Waypoint {
  id: number;
  name: string;
  lat: string;
  lon: string;
  description: string;
  image: string;
  locationName: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})

export class ManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  showUserForm: boolean = false;
  showLocationForm: boolean = false;
  showWaypointForm: boolean = false;
  newUser: User = {id: 0, name: '', username: '', password: ''};
  newLocation: Location = {id: 0, location: '', region: '', lat: '', lon: ''};
  newWaypoint: Waypoint = {id: 0, name: '', lat: '', lon: '', description: '', image: '', locationName: ''};

  constructor() {
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {

  }


  ngAfterViewInit() {

  }

  userList: User[] = [
    {id: 1, name: 'John', username: 'john@test.com', password: '0790000000'},
    {id: 2, name: 'Jane', username: 'jane@test.com', password: '0790000001'},
    {id: 3, name: 'Bob', username: 'bob@test.com', password: '0790000002'},
  ];

  locationList: Location[] = [
    {id: 1, location: 'New York', region: "US", lat: "40.7128", lon: "74.0060"},
    {id: 2, location: 'London', region: "UK", lat: "51.5074", lon: "0.1278"},
    {id: 3, location: 'Paris', region: "FR", lat: "48.8566", lon: "2.3522"},
  ];

  waypointList: Waypoint[] = [
    {id: 1, name: 'Statue of Liberty', lat: "40.6892", lon: "74.0445", description: "Statue of Liberty", image: "", locationName: "New York"},
    {id: 2, name: 'Big Ben', lat: "51.5007", lon: "0.1246", description: "Big Ben", image: "", locationName: "London"},
    {id: 3, name: 'Eiffel Tower', lat: "48.8584", lon: "2.2945", description: "Eiffel Tower", image: "", locationName: "Paris"},
  ];

  addUser(name: string, username: string, password: string) {
    const id = this.userList.length + 1;
    const newUser: User = {id, name, username: username, password: password};
    this.userList.push(newUser);
    this.showUserForm = false;
  }

  addLocation(name: string, region: string, lat: string, lon: string) {
    const id = this.locationList.length + 1;
    const newLocation: Location = {id, location: name, region: region, lat: lat, lon: lon};
    this.locationList.push(newLocation);
  }

  addWaypoint(name: string, lat: string, lon: string, description: string, image: string, locationName: string) {
    const id = this.waypointList.length + 1;
    const newWaypoint: Waypoint = {id, name, lat: lat, lon: lon, description: description, image: image, locationName: locationName};
    this.waypointList.push(newWaypoint);
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
