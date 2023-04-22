import {Component, OnInit, SimpleChanges, OnChanges} from '@angular/core';
import {Locations} from "../interface/data";
import {ReadjsonService} from "../service/readjson.service";
import {ActivatedRoute} from "@angular/router";
import {positionService} from "../service/position.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnChanges {
  locationParams: string | undefined
  locations: Partial<Locations>[] | undefined;
  location: Partial<Locations> | undefined;

  positionCord: any;

  isNear: boolean = true;

  distance: number[] = [];


  constructor(private route: ActivatedRoute, private readjsonService: ReadjsonService, private positionService: positionService) {
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.locationParams = params['location'];
    });
    this.readjsonService.getLocations().subscribe(locations => {
      this.locations = locations;
      if (this.locationParams != null) {
        this.readjsonService.getLocation(this.locationParams ?? "").subscribe(async location => {
          this.location = location;
          this.readjsonService.getWaypoints(this.locationParams ?? "").subscribe(waypoints => {
            if (this.location) {
              this.location.waypoints = waypoints ?? []
            }
          });
          await this.checkDataPopulated();
        });
      }
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['positionCord'] && (changes['positionCord'])) {
      console.log("onChanges")
      this.setDistance();
    }
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

    const intervalId = setInterval(() => {
      if (this.location) {
        if (this.location?.waypoints) {
          console.log("setDistance"+this.location);
          for (let i = 0; i < this.location.waypoints.length; i++) {
            console.log("for")
            this.distance.push(this.positionService.getDistanceBetweenCoordinates(this.location.waypoints[i].lat, this.location?.lon, this.positionCord.lat, this.positionCord.lon));
          }
          clearInterval(intervalId);
        }
        console.log("ciao" + this.distance[0])
      }}, 1000);
    //da aggiungere il cambiamento in tutti i punti, forse fatto ma sono stanco
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
