import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {distinctUntilChanged, fromEvent, Subject, Subscription} from "rxjs";
import {ReadjsonService} from "../service/readjson.service";
import {Locations} from "../interface/data";

interface Luogo {
  location: string;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('myInput') myInput?: ElementRef;
  @ViewChild('myCanvas') myCanvas?: ElementRef<HTMLCanvasElement>;

  luoghiPopup: Subject<Luogo[]> = new Subject<Luogo[]>()

  subs: Subscription[] = []

  latitude: number | undefined;
  longitude: number | undefined;
  backgroundColor: string | undefined;
  locations: Locations[] = [
    {location: 'Locarno', region: 'Ticino', lat: 46.1704, lon: 8.7931},
    {location: 'Lugano', region: 'Ticino', lat: 46.0037, lon: 8.9511},
    {location: 'Luzern', region: 'Luzern', lat: 47.0502, lon: 8.3093},
    {location: 'Lauterbrunnen', region: 'Bern', lat: 46.5939, lon: 7.9085}
  ];

  luoghi: Luogo[] = [
    {location: 'Locarno', lat: 46.1704, lon: 8.7931},
    {location: 'Lugano', lat: 46.0037, lon: 8.9511},
    {location: 'Luzern', lat: 47.0502, lon: 8.3093},
    {location: 'Lauterbrunnen', lat: 46.5939, lon: 7.9085}
  ];
  locationsFiltrati: Locations[] = [];
  luoghiFiltrati: Luogo[] = [];
  luogoSelezionato: string = '';
  suggerimentoAttivo: boolean = false;
  suggerimento: string = '';
  completamento: string = 'ciao';

  constructor(private service: ReadjsonService) {
  }

  ngOnInit(): void {
    console.log("home init");
    this.subs.push(this.service.getLocation("Lugano").subscribe(val => console.log(val)))
  }

  ngAfterViewInit() {
    console.log("canvas", this.myCanvas?.nativeElement);
    const canvas = this.myCanvas?.nativeElement;
    console.log("canvas 2", canvas);
    if (canvas)
      this.animateClouds(canvas);

    fromEvent(this.myInput?.nativeElement, 'focus').pipe(
      // debounceTime(500), decommentarlo se bisogna fare una chiamata http
      distinctUntilChanged()
    ).subscribe((val: any) => {
      this.luoghiPopup.next(this.locations.filter(l => l.location.toLowerCase().startsWith(val.target.value.toLowerCase())
      ))})

    fromEvent(this.myInput?.nativeElement, 'input')
      .pipe(
        // debounceTime(500), decommentarlo se bisogna fare una chiamata http
        distinctUntilChanged()
      ).subscribe((val: any) => {
      this.luoghiPopup.next(this.luoghi.filter(l => l.location.toLowerCase().startsWith(val.target.value.toLowerCase())))
    })
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  animateClouds(canvas: HTMLCanvasElement): void {
    console.log("animating clouds")
    let x = -200;
    let y = 100;
    let speed = 2;
    let rand = 30;
    let ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    setInterval(() => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawCloud(x, y, ctx);
        x += speed;
        if (x > canvas.width + 200) {
          x = -200;
        }
      }
      rand = Math.round(Math.random() * (10 - 500)) + 10
    }, rand);
  }

  drawCloud(x: number, y: number, ctx: CanvasRenderingContext2D) {
    console.log("xy:"+ x, y)
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, 2 * Math.PI);
    ctx.arc(x + 25, y - 25, 50, 0, 2 * Math.PI);
    ctx.arc(x + 75, y - 25, 50, 0, 2 * Math.PI);
    ctx.arc(x + 50, y, 50, 0, 2 * Math.PI);
    ctx.fillStyle = "#87CEEB";
    ctx.fill();
  }

  cercaLuogo(locations: string){
    setTimeout(()=>{
    }, 1000);
    this.locationsFiltrati = this.locations.filter((l: Locations) => l.location.toLowerCase().startsWith(locations.toLowerCase()));
    if(this.locationsFiltrati.length > 0){
      this.suggerimentoAttivo = true;
      this.suggerimento = this.locationsFiltrati[0].location;
      this.completamento = stringDifference(locations, this.suggerimento);
    } else {
      this.suggerimentoAttivo = false;
      this.suggerimento = '';
    }
  }

  consigliaSuggerimento(locations: string) {
    if (this.suggerimentoAttivo) {
      this.luogoSelezionato = locations + "-" + this.completamento;
      this.suggerimento = '';
    }
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

