import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {distinctUntilChanged, fromEvent, Subject, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {TranslateService} from '../service/language/translate.service';
import {ReadTranslateJsonService} from "../service/language/readTranslateJson.service";
import {homeTranslations} from "../interface/translations";
import {LocationService} from "../service/http/location.service";
import {LocationEntity} from "../interface/LocationEntity";
import {cookieService} from "../service/cookie.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('myInput') myInput?: ElementRef;

  username: string = '';
  subs: Subscription[] = [];
  backgroundColor: string | undefined;
  locations: LocationEntity[] = [];
  allert: boolean = false;
  locationsFiltrati: LocationEntity[] = [];
  luogoSelezionato: string = '';
  suggerimentoAttivo: boolean = false;
  suggerimento: string = '';
  completamento: string = '';
  translations: homeTranslations = {} as homeTranslations;
  public locationsPopup: Subject<LocationEntity[]> = new Subject<LocationEntity[]>()


  constructor(
    private router: Router,
    private translateService: TranslateService,
    private readTranslationJsonService: ReadTranslateJsonService,
    private locationService: LocationService,
    private cookieService: cookieService,
  ) {
  }

  // Initializes the component and loads translations and locations
  ngOnInit(): void {
    this.translations = this.readTranslationJsonService.getHomeTranslations();
    console.log("translations loaded", this.translations);
    this.username= this.cookieService.getUsername();
    this.locationService.getLocations()
      .subscribe(locations => {
        this.locations = locations;
        console.log("locations loaded", this.locations)
      });
    this.allert = false;
    console.log("home init");
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
  }


  //This method sets up event listeners for input field changes to filter locations.
  ngAfterViewInit() {

    if (this.locations != undefined) {
      fromEvent(this.myInput?.nativeElement, 'focus').pipe(
        // debounceTime(500), decommentarlo se bisogna fare una chiamata http
        distinctUntilChanged()
      ).subscribe((val: any) => {
        this.locationsPopup.next(this.locations.filter(l => l.location.toLowerCase().startsWith(val.target.value.toLowerCase())))
      })
    }

    fromEvent(this.myInput?.nativeElement, 'input')
      .pipe(
        // debounceTime(500), decommentarlo se bisogna fare una chiamata http
        distinctUntilChanged()
      ).subscribe((val: any) => {
      this.locationsPopup.next(this.locations.filter(l => l.location.toLowerCase().startsWith(val.target.value.toLowerCase())))
    })
  }

  // Filters locations based on user input and shows suggestions
  cercaLuogo(locations: string) {
    // Delay for 1 second
    setTimeout(() => {
    }, 1000);
    // Filter locations and store in a variable
    this.locationsFiltrati = this.locations.filter((l: LocationEntity) => l.location.toLowerCase().startsWith(locations.toLowerCase()));
    if (this.locationsFiltrati.length > 0) {
      // Show suggestion if at least one location is found
      this.suggerimentoAttivo = true;
      this.suggerimento = this.locationsFiltrati[0].location;
      // Find the difference between user input and suggestion
      this.completamento = stringDifference(locations, this.suggerimento);
    } else {
      // Hide suggestion if no location is found
      this.suggerimentoAttivo = false;
      this.suggerimento = '';
    }
    // Focus on input field
    this.myInput?.nativeElement.focus();
  }

  // Selects the suggestion if the user presses "Tab" or "Enter" keys and if there is an active suggestion.
  // The selected location is then assigned to the "luogoSelezionato" variable, and the suggestion is cleared.
  selezionaSuggerimento(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      if (this.suggerimentoAttivo) {
        this.luogoSelezionato = this.suggerimento;
        this.suggerimentoAttivo = false;
        this.suggerimento = '';
      }
    }
  }

//Method to handle search functionality.
// If the selected location is empty, an alert is displayed for 3 seconds.
// Otherwise, the selected location is encoded and used to navigate to the corresponding location page using Angular router.
  onSearch(): void {
    if (this.luogoSelezionato === '') {
      this.allert = true;
      setTimeout(() => {
        this.allert = false;
      }, 3000);
      return;
    } else {
      const nomeLocation = encodeURIComponent(this.luogoSelezionato);
      this.router.navigate(['/location', nomeLocation]);
    }
  }

  // This async function is used to switch the language of the application.
  // It takes a language code as input and updates the translations object with new translations for various UI elements.
  // The getData() method of the translateService is called with the current translations and the new language code.
  // The translateService returns the translated data which is then assigned to the corresponding properties of the translations object.
  async switchLanguage(lang: string) {
    this.translations.translate = await this.translateService.getData(this.translations.translate, lang);
    this.translations.menuPlaces = await this.translateService.getData(this.translations.menuPlaces, lang);
    this.translations.alertMessage = await this.translateService.getData(this.translations.alertMessage, lang);
    this.translations.searchPlaceholder = await this.translateService.getData(this.translations.searchPlaceholder, lang);
    this.translations.searchButton = await this.translateService.getData(this.translations.searchButton, lang);
  }
}


/**
 * Returns the difference between two strings, by comparing their characters one by one.
 * @param str1 - First string to compare
 * @param str2 - Second string to compare
 * @returns The difference between the two strings
 */
function stringDifference(str1: string, str2: string): string {
  let diff = '';
  for (let i = 0; i < str2.length; i++) {
    if (str1[i] !== str2[i]) {
      diff += str2[i];
    }
  }
  return diff;
}
