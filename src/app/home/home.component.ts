import {Component, OnInit} from '@angular/core';

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
export class HomeComponent implements OnInit {
  latitude: number | undefined;
  longitude: number | undefined;
  backgroundColor: string | undefined;

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
  completamento: string = 'ciao';

  @ViewChild('myInput') myInput?: ElementRef;

  ngAfterViewInit() {
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
      this.completamento = stringDifference(nome, this.suggerimento);

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

