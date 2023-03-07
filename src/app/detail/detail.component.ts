import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  ngOnInit(): void {
    this.getLocation();
  }

  test = {
    name: 'SPAI',
    cordinates: "46.15187077044123, 8.799829438699243",
    description: "Lorem ipsum"
  }

  cord = {
    lat: 0,
    lng: 0
  }

  showNav = true;
  distance: number | undefined;
  displayedDistance = 0;

  getLocation() {
    console.log("get location");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.cord.lat = position.coords.latitude;
        this.cord.lng = position.coords.longitude;
        console.log(this.cord);
        this.checkDistanceTimer();
      })
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  checkDistanceTimer() {
    //set interval
    let lat1 = this.cord.lat;
    let lon1 = this.cord.lng;
    let lat2 = this.test.cordinates.split(",")[0];
    let lon2 = this.test.cordinates.split(",")[1];
    let intervalID = setInterval(() => {
      if (this.showNav) {
        this.distance = this.getDistanceBetweenCoordinates(lat1, lon1, +lat2, +lon2);
        console.log(this.distance);
        if (this.distance == 0) {
          this.showNav = false;
          this.displayedDistance = Math.round(this.distance * 100) / 100;
        }

        if (this.distance < 0.05) {
          this.showNav = false;
          clearInterval(intervalID);
        }
      } else {
        clearInterval(intervalID);
      }
    }, 1000);
  }

  getDistanceBetweenCoordinates(lat1: number, lon1: number, lat2: number, lon2: number) {
    const earthRadius = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
     // Distance in km
    return earthRadius * c;
  }

  deg2rad(deg: number) {
    return deg * (Math.PI / 180)
  }

  ///
}
