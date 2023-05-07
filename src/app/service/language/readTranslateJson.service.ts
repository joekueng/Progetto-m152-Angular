import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  detailTranslations,
  homeTranslations,
  loginTranslations,
  managementTranslations
} from "../../interface/translations";
import {listTranslations} from "../../interface/translations";

@Injectable({
  providedIn: 'root'
})
export class ReadTranslateJsonService {
  private homeTranslations: homeTranslations = {} as homeTranslations;  // declares a private object to hold the home translations
  private listTranslation: listTranslations = {} as listTranslations;  // declares a private object to hold the list translations
  private managementTransaltion: managementTranslations = {} as managementTranslations;  // declares a private object to hold the management translations
  private loginTranslation: loginTranslations = {} as loginTranslations // declares a private object to hold the login translations
  private detailTranslation: detailTranslations = {} as detailTranslations // declares a private object to hold the detail translations

  constructor(private http: HttpClient) {
    // loads the home translations from the assets file for the English language
    this.http.get<homeTranslations>('assets/i18n/home/en.json').subscribe(data => {
      this.homeTranslations.alertMessage = data.alertMessage;
      this.homeTranslations.translate = data.translate;
      this.homeTranslations.searchButton = data.searchButton;
      this.homeTranslations.searchPlaceholder = data.searchPlaceholder;
      this.homeTranslations.menuPlaces = data.menuPlaces;
    });

    // loads the list translations from the assets file for the English language
    this.http.get<listTranslations>('assets/i18n/list/en.json').subscribe(data => {
      this.listTranslation.translate = data.translate;
      this.listTranslation.distance = data.distance;
      this.listTranslation.locationName = data.locationName;
      this.listTranslation.positionNotFoundErrorMessage = data.positionNotFoundErrorMessage;
      this.listTranslation.waypointVisitedPercentage = data.waypointVisitedPercentage;
    });

    this.http.get<managementTranslations>('assets/i18n/management/en.json').subscribe(data => {
      this.managementTransaltion.translate = data.translate;
      this.managementTransaltion.users = data.users;
      this.managementTransaltion.locations = data.locations;
      this.managementTransaltion.waypoints = data.waypoints;
      this.managementTransaltion.name = data.name;
      this.managementTransaltion.username = data.username;
      this.managementTransaltion.password = data.password;
      this.managementTransaltion.location = data.location;
      this.managementTransaltion.region = data.region;
      this.managementTransaltion.lat = data.lat;
      this.managementTransaltion.lon = data.lon;
      this.managementTransaltion.description = data.description;
      this.managementTransaltion.locationName = data.locationName;
      this.managementTransaltion.image = data.image;
      this.managementTransaltion.addUserButton = data.addUserButton;
      this.managementTransaltion.addLocationButton = data.addLocationButton;
      this.managementTransaltion.addWaypointButton = data.addWaypointButton;
      this.managementTransaltion.add = data.add;
      this.managementTransaltion.close = data.close;
    });

    this.http.get<loginTranslations>('assets/i18n/login/en.json').subscribe(data => {
      this.loginTranslation.login = data.login;
      this.loginTranslation.register = data.register;
      this.loginTranslation.username = data.username;
      this.loginTranslation.password = data.password;
      this.loginTranslation.usernamePlaceholder = data.usernamePlaceholder;
      this.loginTranslation.passwordPlaceholder = data.passwordPlaceholder;
    });

    this.http.get<detailTranslations>('assets/i18n/detail/en.json').subscribe(data => {
      this.detailTranslation.congratulations = data.congratulations;
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

  getManagementTranslations(): managementTranslations {
    return this.managementTransaltion;
  }

  getLoginTranslations(): loginTranslations{
    return this.loginTranslation;
  }

  getDetailTranslations(): detailTranslations{
    return this.detailTranslation;
  }
}
