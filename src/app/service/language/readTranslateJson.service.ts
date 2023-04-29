import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {homeTranslations} from "../../interface/translations";
import {listTranslations} from "../../interface/translations";

@Injectable({
  providedIn: 'root'
})
export class ReadTranslateJsonService {
  private homeTranslations: homeTranslations = {} as homeTranslations;  // declares a private object to hold the home translations
  private listTranslation: listTranslations = {} as listTranslations;  // declares a private object to hold the list translations

  constructor(private http: HttpClient) {
    // loads the home translations from the assets file for the English language
    this.http.get<homeTranslations>('assets/i18n/home/en.json').subscribe(data => {
      this.homeTranslations.alertMessage = data.alertMessage;
      this.homeTranslations.translate = data.translate;
      this.homeTranslations.searchButton = data.searchButton;
      this.homeTranslations.searchPlaceholder = data.searchPlaceholder;
      this.homeTranslations.menuPlaces = data.menuPlaces;
      console.log("data loaded", this.homeTranslations)
    });

    // loads the list translations from the assets file for the English language
    this.http.get<listTranslations>('assets/i18n/list/en.json').subscribe(data => {
      this.listTranslation.translate = data.translate;
      this.listTranslation.distance = data.distance;
      this.listTranslation.locationName = data.locationName;
      this.listTranslation.positionNotFoundErrorMessage = data.positionNotFoundErrorMessage;
      console.log("data loaded", this.homeTranslations)
    });
  }

  // returns the home translations object
  getHomeTranslations(): homeTranslations {
    return this.homeTranslations;
  }

  // returns the list translations object
  getListTransaltions(): listTranslations {
    return this.listTranslation;
  }
}
