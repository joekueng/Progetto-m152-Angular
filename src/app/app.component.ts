import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {
  detailTranslations,
  homeTranslations,
  listTranslations,
  loginTranslations,
  managementTranslations
} from "./interface/translations";
import {TranslateService} from "./service/language/translate.service";
import {ReadTranslateJsonService} from "./service/language/readTranslateJson.service";
import {cookieService} from "./service/cookie.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'm-152';

  homeTranslations: homeTranslations = {} as homeTranslations;
  listTranslations: listTranslations = {} as listTranslations;
  managementTranslation: managementTranslations = {} as managementTranslations;
  loginTranslation: loginTranslations = {} as loginTranslations;
  detailTranslation: detailTranslations = {} as detailTranslations;


  constructor(
    private cookieService: cookieService,
    private router: Router,
    private translateService: TranslateService,
    private readTranslationJsonService: ReadTranslateJsonService,
  ) {
  }

  ngOnInit() {
    this.homeTranslations = this.readTranslationJsonService.getHomeTranslations();
    this.listTranslations = this.readTranslationJsonService.getListTransaltions();
    this.managementTranslation = this.readTranslationJsonService.getManagementTranslations();
    this.loginTranslation = this.readTranslationJsonService.getLoginTranslations();
    this.detailTranslation = this.readTranslationJsonService.getDetailTranslations()
  }

  clearAllCookies() {
    this.cookieService.deleteUsername();
    this.router.navigate(['/login']);
  }


  // This async function is used to switch the language of the application.
  // It takes a language code as input and updates the translations object with new translations for various UI elements.
  // The getData() method of the translateService is called with the current translations and the new language code.
  // The translateService returns the translated data which is then assigned to the corresponding properties of the translations object.
  async switchLanguage(lang: string) {
    // Load Home Page Translations
    this.homeTranslations.translate = await this.translateService.getData(this.homeTranslations.translate, lang);
    this.homeTranslations.menuPlaces = await this.translateService.getData(this.homeTranslations.menuPlaces, lang);
    this.homeTranslations.alertMessage = await this.translateService.getData(this.homeTranslations.alertMessage, lang);
    this.homeTranslations.searchPlaceholder = await this.translateService.getData(this.homeTranslations.searchPlaceholder, lang);
    this.homeTranslations.searchButton = await this.translateService.getData(this.homeTranslations.searchButton, lang);

    // Load List Page Translations
    this.listTranslations.distance = await this.translateService.getData(this.listTranslations.distance, lang);
    this.listTranslations.locationName = await this.translateService.getData(this.listTranslations.locationName, lang);
    this.listTranslations.positionNotFoundErrorMessage = await this.translateService.getData(this.listTranslations.positionNotFoundErrorMessage, lang);
    this.listTranslations.waypointVisitedPercentage = await this.translateService.getData(this.listTranslations.waypointVisitedPercentage, lang);

    // Load Management Page Translations
    this.managementTranslation.users = await this.translateService.getData(this.managementTranslation.users, lang);
    this.managementTranslation.locations = await this.translateService.getData(this.managementTranslation.locations, lang);
    this.managementTranslation.waypoints = await this.translateService.getData(this.managementTranslation.waypoints, lang);
    this.managementTranslation.name = await this.translateService.getData(this.managementTranslation.name, lang);
    this.managementTranslation.username = await this.translateService.getData(this.managementTranslation.username, lang);
    this.managementTranslation.password = await this.translateService.getData(this.managementTranslation.password, lang);
    this.managementTranslation.location = await this.translateService.getData(this.managementTranslation.location, lang);
    this.managementTranslation.region = await this.translateService.getData(this.managementTranslation.region, lang);
    this.managementTranslation.lat = await this.translateService.getData(this.managementTranslation.lat, lang);
    this.managementTranslation.lon = await this.translateService.getData(this.managementTranslation.lon, lang);
    this.managementTranslation.description = await this.translateService.getData(this.managementTranslation.description, lang);
    this.managementTranslation.locationName = await this.translateService.getData(this.managementTranslation.locationName, lang);
    this.managementTranslation.image = await this.translateService.getData(this.managementTranslation.image, lang);
    this.managementTranslation.translate = await this.translateService.getData(this.managementTranslation.translate, lang);
    this.managementTranslation.addLocationButton = await this.translateService.getData(this.managementTranslation.addLocationButton, lang);
    this.managementTranslation.addUserButton = await this.translateService.getData(this.managementTranslation.addUserButton, lang);
    this.managementTranslation.addWaypointButton = await this.translateService.getData(this.managementTranslation.addWaypointButton, lang);
    this.managementTranslation.edit = await this.translateService.getData(this.managementTranslation.edit, lang);
    this.managementTranslation.add = await this.translateService.getData(this.managementTranslation.add, lang);
    this.managementTranslation.close = await this.translateService.getData(this.managementTranslation.close, lang);

    // Load Login Page Translations
    this.loginTranslation.username = await this.translateService.getData(this.loginTranslation.username, lang);
    this.loginTranslation.password = await this.translateService.getData(this.loginTranslation.password, lang);
    this.loginTranslation.login = await this.translateService.getData(this.loginTranslation.login, lang);
    this.loginTranslation.register = await this.translateService.getData(this.loginTranslation.register, lang);
    this.loginTranslation.usernamePlaceholder = await this.translateService.getData(this.loginTranslation.usernamePlaceholder, lang);
    this.loginTranslation.passwordPlaceholder = await this.translateService.getData(this.loginTranslation.passwordPlaceholder, lang);
    this.loginTranslation.errorLogin = await this.translateService.getData(this.loginTranslation.errorLogin, lang);
    this.loginTranslation.errorCreateUser = await this.translateService.getData(this.loginTranslation.errorCreateUser, lang);

    // Load Detail Page Translations
    this.detailTranslation.congratulations = await this.translateService.getData(this.detailTranslation.congratulations, lang);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
