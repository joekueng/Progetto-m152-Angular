import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {positionService} from "../service/position.service";
import { getDistance } from 'geolib';
// @ts-ignore
import * as sharp from 'sharp';
import * as qrcode from 'qrcode';
import * as canvas from 'canvas';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  private location: string | undefined;
  private id: number | undefined;

  private URLParams: any;

  test = {
    name: 'SPAI',
    cordinates: '46.15187077044123,8.799829438699243',
    lat: 46.15187077044123,
    lng: 8.799829438699243,
    description: "Lorem ipsum"
  }

  embed = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBJL4FWmG032BG6KXxTb4faxpO_ccyaP3o&q=${this.test.lat},${this.test.lng}`

  cord: any;

  showNav = true;
  distance: number | undefined;
  displayedDistance = 0;

  constructor(private route: ActivatedRoute , private positionService: positionService) {}

  async ngOnInit(){
     this.URLParams = this.route.snapshot.url.slice(-2).map(segment => segment.path);
    console.log(this.URLParams); // ["lugnao", "1"]
    console.log("getting your location: wait...");
    this.cord = await this.positionService.getLocation();
    console.log("location: ", this.cord);
    this.checkDistanceTimer();
  }

  checkDistanceTimer() {
    //set interval
    let intervalID = setInterval(() => {
      if (this.showNav) {
        this.distance = this.positionService.getDistanceBetweenCoordinates(this.cord.lat, this.cord.lon, this.test.lat, this.test.lng);
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

  async generateQRCodeImage(url: string): Promise<Buffer> {
    // Crea il QR code
    const qrCode = await qrcode.toDataURL(url, { errorCorrectionLevel: "H" });

    // Crea il canvas
    const canvasInstance = canvas.createCanvas(300, 300);
    const ctx = canvasInstance.getContext("2d");

    // Carica il QR code nell'immagine
    const qrCodeImage = await canvas.loadImage(qrCode);

    // Disegna il QR code nell'immagine
    ctx.drawImage(qrCodeImage, 0, 0, 300, 300);

    // Ritorna l'immagine come buffer
    return canvasInstance.toBuffer();
  }

  /*generateQR() {
    console.log("generating QR code");
    let url = `http://localhost:4200/location/${this.URLParams[0]}/${this.URLParams[1]}`;
    //this.addQRCodeToImage(url, `assets/testDetail/img.png`, `assets/images/${url}.png`);
    console.log(url)
  }*/

  /*async addQRCodeToImage(url: string, imagePath: string, outputPath: string): Promise<void> {
    // Generate QR code
    const qrCode = await qrcode.toBuffer(url);

    // Load input image using Sharp
    const image = sharp(imagePath);

    // Get input image dimensions
    const { width, height } = await image.metadata();

    // Resize QR code to 25% of input image height
    const qrCodeHeight = Math.round(height * 0.25);
    const qrCodeBuffer = await sharp(qrCode)
      .resize(qrCodeHeight, qrCodeHeight)
      .toBuffer();

    // Composite QR code onto input image at bottom-right corner
    await image.composite([
      {
        input: qrCodeBuffer,
        gravity: 'southeast',
        top: height - qrCodeHeight,
        left: width - qrCodeHeight,
      },
    ]);

    // Save output image to file
    await image.toFile(outputPath);
  }*/

}
