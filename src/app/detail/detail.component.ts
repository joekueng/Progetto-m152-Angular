import {Location} from "@angular/common";
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CalculateDistanceService} from "../service/calculateDistance.service";

import * as QRCode from 'qrcode';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DetailComponent implements OnInit {

  private location: string | undefined;
  private id: number | undefined;

  constructor(private route: ActivatedRoute, private calculateDistanceService: CalculateDistanceService) {}

  ngOnInit(): void {
    // Ascoltare i parametri passati nell'url
    this.route.params.subscribe(params => {
      this.location = params['location'];
      this.id = params['id'];
    })
    console.log(this.location);
    console.log(this.id);
    // Recupera la posizione dell'utente
    this.getLocation();
  }

  // Definizione della destinazione del viaggio (sostituire con dati reali)
  test = {
    name: 'SPAI',
    cordinates: '46.175248719308,8.79395345868349',
    lat: 46.175248719308,
    lng: 8.79395345868349,
    description: "Lorem ipsum"
  }

  cord = {
    lat: 0,
    lng: 0
  }

  showNav = false;
  distance: number | undefined;
  displayedDistance = 0;
  embed: string = ``;

  // Recupera la posizione dell'utente
  getLocation() {
    console.log(this.embed)
    console.log("get location");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showNav = true;
        this.cord.lat = position.coords.latitude;
        this.cord.lng = position.coords.longitude;
        console.log(this.cord);
        this.embed = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBJL4FWmG032BG6KXxTb4faxpO_ccyaP3o&origin=${this.cord.lat},${this.cord.lng}&destination=${this.test.lat},${this.test.lng}&mode=walking`
        this.checkDistanceTimer();
      })
    } else {
      alert("Geolocation non è supportato dal tuo browser.");
    }
  }

  // Verifica la distanza tra la posizione dell'utente e la destinazione
  checkDistanceTimer() {
    let lat1 = this.cord.lat;
    let lon1 = this.cord.lng;
    let lat2 = this.test.lat;
    let lon2 = this.test.lng;
    let intervalID = setInterval(() => {
      if (this.showNav) {
        this.distance = this.calculateDistanceService.getDistanceBetweenCoordinates(lat1, lon1, +lat2, +lon2);
        console.log(this.distance);
        if (this.distance == 0) {
          this.showNav = false;
          this.displayedDistance = Math.round(this.distance * 100) / 100;
        }
        if (this.distance < 0.05) {
          this.showNav = false;
          clearInterval(intervalID);
        }
      } else {
        clearInterval(intervalID);
      }
    }, 1000);
  }

  generateQRCode(): void {
    alert("QR Code generato")
    // Generate a QR code of the current URL and set it as the QR code image
    QRCode.toDataURL("", {errorCorrectionLevel: 'H'}, (err, url) => {
      //this.qrCodeImage = url;
      console.log(url);
    });
  }
}
