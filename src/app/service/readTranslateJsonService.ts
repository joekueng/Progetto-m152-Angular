import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {homeTranslations} from "../interface/translations";
import {listTranslations} from "../interface/translations";

@Injectable({
  providedIn: 'root'
})
export class ReadTranslateJsonService {
  private homeTranslations: homeTranslations = {} as homeTranslations;
  private listTranslation: listTranslations = {} as listTranslations;

  constructor(private http: HttpClient) {
    this.http.get<homeTranslations>('assets/i18n/home/en.json').subscribe(data => {
      this.homeTranslations.alertMessage = data.alertMessage;
      this.homeTranslations.translate = data.translate;
      this.homeTranslations.searchButton = data.searchButton;
      this.homeTranslations.searchPlaceholder = data.searchPlaceholder;
      this.homeTranslations.menuPlaces = data.menuPlaces;
      console.log("data loaded", this.homeTranslations)
    });

    this.http.get<listTranslations>('assets/i18n/list/en.json').subscribe(data => {
      this.listTranslation.translate = data.translate;
      this.listTranslation.distance = data.distance;
      this.listTranslation.locationName = data.locationName;
      this.listTranslation.positionNotFoundErrorMessage = data.positionNotFoundErrorMessage;
      console.log("data loaded", this.homeTranslations)
    });
  }

  getHomeTranslations(): homeTranslations {
    return this.homeTranslations;
  }

  getListTransaltions(): listTranslations {
    return this.listTranslation;
  }
}
