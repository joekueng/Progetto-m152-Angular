import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {distinctUntilChanged, fromEvent, Observable, Subject, Subscription} from "rxjs";
import {ReadjsonService} from "../service/readjson.service";
import {Locations} from "../interface/data";
import * as QRCode from 'qrcode';
import {Router} from "@angular/router";

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

  public locationsPopup: Subject<Locations[]> = new Subject<Locations[]>()

  subs: Subscription[] = [];
  backgroundColor: string | undefined;
  qrCodeImage: string | undefined;
  locations: Locations[] = [];
  allert: boolean = false;
  locationsFiltrati: Locations[] = [];
  luogoSelezionato: string = '';
  suggerimentoAttivo: boolean = false;
  suggerimento: string = '';
  completamento: string = 'ciao';

  @ViewChild('canvas') canvasRef: ElementRef | undefined;
  canvas: any;
  ctx: any;
  img: any;


  constructor(private readjsonService: ReadjsonService, private router: Router) {
  }

  ngOnInit(): void {
    this.readjsonService.getLocations().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.locations.push(<Locations>data[i])
        console.log(data[i])
      }
    });
    this.allert = false;
    console.log("home init");
    this.subs.push(this.readjsonService.getLocation("Lugano").subscribe(val => console.log(val)))
    const text = 'https://aramisgrata.ch'; // sostituisci con la tua stringa
    QRCode.toDataURL(text, {errorCorrectionLevel: 'H'}, (err, url) => {
      this.qrCodeImage = url;
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
  }


  ngAfterViewInit() {
    const canvas = this.myCanvas?.nativeElement;
    if (canvas)
      this.animateClouds(canvas);

    if (this.locations != undefined) {
      fromEvent(this.myInput?.nativeElement, 'focus').pipe(
        // debounceTime(500), decommentarlo se bisogna fare una chiamata http
        distinctUntilChanged()
      ).subscribe((val: any) => {
        this.locationsPopup.next(this.locations.filter(l => l.location.toLowerCase().startsWith(val.target.value.toLowerCase())))
      })
    }


    this.canvas = this.canvasRef?.nativeElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');

      this.img = new Image();
      this.img.onload = () => {
        this.ctx.drawImage(this.img, 0, 0);
        const qrCode = new Image();
        if (typeof this.qrCodeImage === "string") {
          qrCode.src = this.qrCodeImage;
        }
        qrCode.onload = () => {
          const qrCodeSize = 100;
          const margin = 20;
          const x = this.canvas.width - qrCodeSize - margin;
          const y = this.canvas.height - qrCodeSize - margin;
          this.ctx.drawImage(qrCode, x, y, qrCodeSize, qrCodeSize);
        }
      }

      this.img.src = 'src/assets/img/mountains.png';
    }

    fromEvent(this.myInput?.nativeElement, 'input')
      .pipe(
        // debounceTime(500), decommentarlo se bisogna fare una chiamata http
        distinctUntilChanged()
      ).subscribe((val: any) => {
      this.locationsPopup.next(this.locations.filter(l => l.location.toLowerCase().startsWith(val.target.value.toLowerCase())))
    })
  }

  animateClouds(canvas: HTMLCanvasElement): void {
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
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, 2 * Math.PI);
    ctx.arc(x + 25, y - 25, 50, 0, 2 * Math.PI);
    ctx.arc(x + 75, y - 25, 50, 0, 2 * Math.PI);
    ctx.arc(x + 50, y, 50, 0, 2 * Math.PI);
    ctx.fillStyle = "#87CEEB";
    ctx.fill();
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
      this.allert=true;
      setTimeout(() => {
        this.allert=false;
      }, 8000);
      return;
    }else{
      const nomeLocation = encodeURIComponent(this.luogoSelezionato);
      this.router.navigate(['/location', nomeLocation]);
    }
  }

  protected readonly Event = Event;
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
