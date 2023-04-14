import {Component, OnInit} from '@angular/core';
import {Locations} from "../interface/data";
import {ReadjsonService} from "../service/readjson.service";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private locationParams: string | undefined
  locations: Partial<Locations>[] | undefined;
  location: Partial<Locations> | undefined;

  isNear: boolean = true;


  constructor(private route: ActivatedRoute ,private readjsonService: ReadjsonService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.locationParams = params['location'];
    });

    this.readjsonService.getLocations().subscribe(locations => {
      this.locations = locations;
      this.checkDataPopulated();
    });

    if (this.locationParams != null) {
      this.readjsonService.getLocation(this.locationParams).subscribe(location => {
        this.location = location;
        this.checkDataPopulated();
      });
    }
  }

  private checkDataPopulated(): void {
    if (this.locations && this.location) {
      console.log("Dati popolati correttamente:", this.locations, this.location);
      for (let i = 0; i < this.locations.length; i++) {
        if (this.locations[i].location === this.locationParams) {
          this.location = this.locations[i];
          console.log("Location trovata:", this.location);
          this.isNear= false;
          break;
        }
      }
    }
  }

}
