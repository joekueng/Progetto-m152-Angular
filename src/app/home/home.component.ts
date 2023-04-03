import {AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, fromEvent, Subject} from "rxjs";
import * as QRCode from 'qrcode';

interface Luogo {
  nome: string;
  latitudine: number;
  longitudine: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  luoghiPopup: Subject<Luogo[]> = new Subject<Luogo[]>()

  latitude: number | undefined;
  longitude: number | undefined;
  backgroundColor: string | undefined;
  qrCodeImage: string | undefined;

  luoghi: Luogo[] = [
    {nome: 'Locarno', latitudine: 46.1704, longitudine: 8.7931},
    {nome: 'Lugano', latitudine: 46.0037, longitudine: 8.9511},
    {nome: 'Luzern', latitudine: 47.0502, longitudine: 8.3093},
    {nome: 'Lauterbrunnen', latitudine: 46.5939, longitudine: 7.9085}
  ];
  luoghiFiltrati: Luogo[] = [];
  luogoSelezionato: string = '';
  suggerimentoAttivo: boolean = false;
  suggerimento: string = '';
  completamento: string = '';

  @ViewChild('myInput') myInput?: ElementRef;
  @ViewChild('canvas') canvasRef: ElementRef | undefined;
  canvas: any;
  ctx: any;
  img: any;

  ngAfterViewInit() {

    this.canvas = this.canvasRef?.nativeElement;
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


    fromEvent(this.myInput?.nativeElement, 'input')
      .pipe(
        // debounceTime(500), decommentarlo se bisogna fare una chiamata http
        distinctUntilChanged()
      ).subscribe((val: any) => {
      this.luoghiPopup.next(this.luoghi.filter(l => l.nome.toLowerCase().startsWith(val.target.value.toLowerCase())))
    })
  }


  cercaLuogo(nome: string){



    setTimeout(() => {

    }, 1000);
    this.luoghiFiltrati = this.luoghi.filter((l: Luogo) => l.nome.toLowerCase().startsWith(nome.toLowerCase()));
    if (this.luoghiFiltrati.length > 0) {
      this.suggerimentoAttivo = true;
      this.suggerimento = this.luoghiFiltrati[0].nome;

    } else {
      this.suggerimentoAttivo = false;
      this.suggerimento = '';
    }
  }

  consigliaSuggerimento(nome: string) {
    if (this.suggerimentoAttivo) {
      this.luogoSelezionato = nome + "-"+this.completamento;
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

  ngOnInit(): void {
    const text = 'https://aramisgrata.ch'; // sostituisci con la tua stringa
    QRCode.toDataURL(text, { errorCorrectionLevel: 'H' }, (err, url) => {
      this.qrCodeImage = url;
    });
  }


  luoghiNear() {
    return null;
  }
}
