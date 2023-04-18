import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {translations} from "../interface/translations";

@Injectable({
  providedIn: 'root'
})
export class ReadTranslateJsonService {
  private translationData: translations = {} as translations;

  constructor(private http: HttpClient) {
    this.http.get<translations>('assets/i18n/en.json').subscribe(data => {
      this.translationData.alertMessage = data.alertMessage;
      this.translationData.translate = data.translate;
      this.translationData.searchButton = data.searchButton;
      this.translationData.searchPlaceholder = data.searchPlaceholder;
      this.translationData.menuPlaces = data.menuPlaces;
      this.translationData.menuNear = data.menuNear;
      console.log("data loaded", this.translationData)
    });
  }

  getData(): translations {
    console.log("data loaded", this.translationData)
    return this.translationData;
  }
}
