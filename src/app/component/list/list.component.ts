import {Component, OnInit, SimpleChanges, OnChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {positionService} from "../../service/position.service";
import {listTranslations} from "../../interface/translations";
import {TranslateService} from "../../service/language/translate.service";
import {ReadTranslateJsonService} from "../../service/language/readTranslateJson.service";
import {LocationService} from "../../service/http/location.service";
import {LocationEntity} from "../../interface/LocationEntity";
import {WaypointsEntity} from "../../interface/WaypointsEntity";
import {WaypointService} from "../../service/http/waypoint.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnChanges {
  locationParams: string | undefined
  locations: LocationEntity[] | undefined;
  location: LocationEntity | undefined;

  waypoints: WaypointsEntity[] | undefined;

  positionCord: any;

  isNear: boolean = true;


  translations: listTranslations = {} as listTranslations

  positionNotFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private positionService: positionService,
    private translateService: TranslateService,
    private readTranslationJsonService: ReadTranslateJsonService,
    private locationService: LocationService,
    private waypointService: WaypointService,
  ) {
  }

  async ngOnInit() {
    this.translations = this.readTranslationJsonService.getListTransaltions();
    this.route.params.subscribe(params => {
      this.locationParams = params['location'];
    });
    this.locationService.getLocation(this.locationParams ?? "").subscribe(location => {
      this.location = location;
      if (this.location.location != null || this.location.location != undefined) {
        this.isNear = false;
        this.waypointService.getWaypoints(this.location.location).subscribe(waypoints => {
          this.waypoints = waypoints;
          console.log("waypoints", this.waypoints)
          this.setDistance()
        });
      }

    });
    this.locationService.getLocations().subscribe(locations => {
      this.locations = locations;
      console.log("locations", this.locations)
      this.setDistance()
    });

    this.getPosition();
    this.positionNotFoundFunction();
  }


  positionNotFoundFunction() {
    if (!this.positionNotFound) {
      setTimeout(() => {
        if (!this.positionCord) {
          this.positionNotFound = true;
        } else {
          if (this.waypoints) {
            if (!this.waypoints[0].distance) {
              this.positionNotFound = true;
            } else {
              this.positionNotFound = false;
            }
          }
          if (this.locations) {
            if (!this.locations[0].distance) {
              this.positionNotFound = true;
            } else {
              this.positionNotFound = false;
            }
          }
        }
      }, 5000);
    }
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
    if (this.waypoints) {
      for (let i = 0; i < this.waypoints.length; i++) {
        this.waypoints[i].distance = this.positionService.getDistanceBetweenCoordinates(this.waypoints[i].lat, this.waypoints[i].lon, this.positionCord.lat, this.positionCord.lon);
      }
    } else {
      if (this.locations) {
        for (let i = 0; i < this.locations.length; i++) {
          this.locations[i].distance = this.positionService.getDistanceBetweenCoordinates(this.locations[i].lat, this.locations[i].lon, this.positionCord.lat, this.positionCord.lon);
        }
      }
    }
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
    this.translations.positionNotFoundErrorMessage = await this.translateService.getData(this.translations.positionNotFoundErrorMessage, lang);
  }
}
