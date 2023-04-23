import {Component, OnInit, SimpleChanges, OnChanges} from '@angular/core';
import {Locations} from "../interface/data";
import {ReadjsonService} from "../service/readjson.service";
import {ActivatedRoute} from "@angular/router";
import {positionService} from "../service/position.service";
import {listTranslations} from "../interface/translations";
import {TranslateService} from "../service/translate.service";
import {ReadTranslateJsonService} from "../service/readTranslateJsonService";

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

  translations: listTranslations = {} as listTranslations

  constructor(private route: ActivatedRoute, private readjsonService: ReadjsonService, private positionService: positionService, private translateService: TranslateService, private readTranslationJsonService: ReadTranslateJsonService) {
  }

  async ngOnInit() {
    this.translations = this.readTranslationJsonService.getListTransaltions();
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
    this.getPosition();
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
    if (this.locations && this.location){
      if (this.isNear){
        console.log("location lenght " + this.locations.length);
        for (let i = 0; i < this.locations.length; i++) {
          console.log("for"+i);
          console.log("lat" + this.locations[i].lat);
          this.distance.push(this.positionService.getDistanceBetweenCoordinates(this.locations[i].lat, this.locations[i].lon, this.positionCord.lat, this.positionCord.lon));
        }
      } else{
        if (this.location?.waypoints) {
          console.log("waypoints lenght " + this.location.waypoints.length);
          for (let i = 0; i < this.location.waypoints.length; i++) {
            console.log("for"+i);
            console.log("lat" + this.location.waypoints[i].lat);
            this.distance.push(this.positionService.getDistanceBetweenCoordinates(this.location.waypoints[i].lat, this.location.waypoints[i].lon, this.positionCord.lat, this.positionCord.lon));
          }
        }
      }
    }
        console.log("ciao" + this.distance[0])
  }

  getPosition(): any {
    setInterval(async () => {
      this.positionCord = await this.positionService.getLocation();
      this.setDistance();
    }, 2000);
  }

  async switchLanguage(lang: string) {
    this.translations.translate = await this.translateService.getData(this.translations.translate, lang);
    this.translations.distance = await this.translateService.getData(this.translations.distance, lang);
    this.translations.locationName = await this.translateService.getData(this.translations.locationName, lang);

  }


}
