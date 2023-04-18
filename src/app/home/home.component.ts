import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, fromEvent, Observable, Subject, Subscription} from "rxjs";
import {ReadjsonService} from "../service/readjson.service";
import {Locations} from "../interface/data";
import {Router} from "@angular/router";
import { TranslateService } from '../service/translate.service';
import {ReadTranslateJsonService} from "../service/readTranslateJsonService";
import {translations} from "../interface/translations";



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('myInput') myInput?: ElementRef;

  public locationsPopup: Subject<Locations[]> = new Subject<Locations[]>()

  subs: Subscription[] = [];
  backgroundColor: string | undefined;
  locations: Locations[] = [];
  allert: boolean = false;
  locationsFiltrati: Locations[] = [];
  luogoSelezionato: string = '';
  suggerimentoAttivo: boolean = false;
  suggerimento: string = '';
  completamento: string = '';
  input: string = 'How are you?';
  translations: translations = {} as translations;


  constructor(private readjsonService: ReadjsonService, private router: Router, private translateService: TranslateService, private readTranslationJsonService: ReadTranslateJsonService) {
  }

  ngOnInit(): void {
    this.translations = this.readTranslationJsonService.getData();
    console.log("translations loaded", this.translations)

    this.readjsonService.getLocations().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.locations.push(<Locations>data[i])
        console.log(data[i])
      }
    });


    this.allert = false;
    console.log("home init");
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
  }


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

  cercaLuogo(locations: string) {
    setTimeout(() => {
    }, 1000);
    this.locationsFiltrati = this.locations.filter((l: Locations) => l.location.toLowerCase().startsWith(locations.toLowerCase()));
    if (this.locationsFiltrati.length > 0) {
      this.suggerimentoAttivo = true;
      this.suggerimento = this.locationsFiltrati[0].location;
      this.completamento = stringDifference(locations, this.suggerimento);
    } else {
      this.suggerimentoAttivo = false;
      this.suggerimento = '';
    }
    this.myInput?.nativeElement.focus();
  }

  selezionaSuggerimento(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      if (this.suggerimentoAttivo) {
        this.luogoSelezionato = this.suggerimento;
        this.suggerimentoAttivo = false;
        this.suggerimento = '';
      }
    }
  }


  luoghiNear() {
    return null;
  }

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

  async switchLanguage(lang: string) {
    this.translations.translate = await this.translateService.getData(this.translations.translate, lang);
    this.translations.menuPlaces = await this.translateService.getData(this.translations.menuPlaces, lang);
    this.translations.alertMessage = await this.translateService.getData(this.translations.alertMessage, lang);
    this.translations.searchPlaceholder = await this.translateService.getData(this.translations.searchPlaceholder, lang);
    this.translations.menuNear = await this.translateService.getData(this.translations.menuNear, lang);
    this.translations.searchButton = await this.translateService.getData(this.translations.searchButton, lang);
  }
}


function stringDifference(str1: string, str2: string): string {
  let diff = '';
  for (let i = 0; i < str2.length; i++) {
    if (str1[i] !== str2[i]) {
      diff += str2[i];
    }
  }
  return diff;
}
