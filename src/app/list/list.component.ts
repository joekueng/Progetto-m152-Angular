import {Component, OnInit} from '@angular/core';
import {Locations} from "../interface/data";
import {ReadjsonService} from "../service/readjson.service";
import {ActivatedRoute} from "@angular/router";
import {positionService} from "../service/position.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private locationParams: string | undefined
  locations: Partial<Locations>[] | undefined;
  location: Partial<Locations> | undefined;

  positionCord: any;

  isNear: boolean = true;

  distance: number = 0;

  constructor(private route: ActivatedRoute, private readjsonService: ReadjsonService, private positionService: positionService) {
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.locationParams = params['location'];
    });
    this.readjsonService.getLocations().subscribe(locations => {
      this.locations = locations;
      if (this.locationParams != null) {
        this.readjsonService.getLocation(this.locationParams).subscribe(location => {
          this.location = location;
          this.checkDataPopulated();
        });
      }
    });
    this.setDistance();
  }

  private checkDataPopulated(): void {
    if (this.locations && this.location) {
      console.log("Dati popolati correttamente:", this.locations, this.location);
      for (let i = 0; i < this.locations.length; i++) {
        if (this.locations[i].location === this.locationParams) {
          this.location = this.locations[i];
          console.log("Location trovata:", this.location);
          this.isNear = false;
          break;
        }
      }
    }
  }

  private setDistance(): void {
    if (this.location && this.isNear) {
      this.distance = this.positionService.getDistanceBetweenCoordinates(this.location.lat, this.location.lon, this.positionCord.lat, this.positionCord.lon);
      console.log("Distanza: " + this.distance + " km");
    }
  }

  getDistance(latLocation: number | undefined, lonLocation: number | undefined): any {
    setInterval(async () => {
      this.positionCord = await this.positionService.getLocation();
      if (this.location) {
        return this.positionService.getDistanceBetweenCoordinates(latLocation, lonLocation, this.positionCord.lat, this.positionCord.lon);
      } else {
        return 0;
      }
    }, 1000);
  }

}
