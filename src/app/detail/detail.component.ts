import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {positionService} from "../service/position.service";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  private location: string | undefined;
  private id: number | undefined;

  test = {
    name: 'SPAI',
    cordinates: '46.15187077044123,8.799829438699243',
    lat: 46.15187077044123,
    lng: 8.799829438699243,
    description: "Lorem ipsum"
  }

  embed = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBJL4FWmG032BG6KXxTb4faxpO_ccyaP3o&q=${this.test.lat},${this.test.lng}`

  cord: any;

  showNav = true;
  distance: number | undefined;
  displayedDistance = 0;

  constructor(private route: ActivatedRoute , private positionService: positionService) {}

  async ngOnInit(){
    this.route.params.subscribe(params => {
      this.location = params['location'];
      this.id = params['id'];
    })
    console.log(this.location);
    console.log(this.id);
    console.log(this.embed);
    this.cord = await this.positionService.getLocation();
    this.checkDistanceTimer();
  }

  checkDistanceTimer() {
    //set interval
    let lat2 = this.test.cordinates.split(",")[0];
    let lon2 = this.test.cordinates.split(",")[1];
    let intervalID = setInterval(() => {
      if (this.showNav) {
        this.distance = this.positionService.getDistanceBetweenCoordinates(this.cord.lat, this.cord.lat, +lat2, +lon2);
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
}
