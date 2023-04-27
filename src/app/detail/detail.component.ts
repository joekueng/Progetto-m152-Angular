import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {positionService} from "../service/position.service";
import * as qrcode from 'qrcode';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  @ViewChild('myModal', { static: true }) myModal!: ElementRef<HTMLInputElement>;
  private location: string | undefined;
  private id: number | undefined;

  private URLParams: any;

  test = {
    name: 'SPAI',
    cordinates: '50.16980727184211, 10.795563727809393',
    lat: 50.16980727184211,
    lng: 9.795563727809393,
    description: "Lorem ipsum"
  }

  embed = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBJL4FWmG032BG6KXxTb4faxpO_ccyaP3o&q=${this.test.lat},${this.test.lng}`

  cord: any;

  showNav = true;
  distance: number | undefined;
  displayedDistance = 0;

  img: any;

  constructor(private route: ActivatedRoute , private positionService: positionService) {}

  async ngOnInit(){
    this.URLParams = this.route.params

    console.log(this.URLParams.location); // {location: "lugano", id: "1"}

    //this.URLParams = this.route.snapshot.url.slice(-2).map(segment => segment.path);
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
          this.generateQR()
          // implement this nex line in angular ts
          this.myModal.nativeElement.checked = true;
          clearInterval(intervalID);
        }
      } else {
        clearInterval(intervalID);
      }
    }, 1000);
  }

  async generateQRCode(url: string) {
    try {
      const string = await qrcode.toString(url, { errorCorrectionLevel: 'H', margin: 1, color: { dark: '#000000FF', light: '#FFFFFFFF' } });
      return string;
    } catch (error) {
      console.error(error);
      throw new Error('Error generating QR code');
    }
  }

  addSvgToImage(imageUrl: string, svgString: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageUrl;

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);

      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(image, 0, 0);
          const svgImage = new Image();
          svgImage.src = svgUrl;

          svgImage.onload = () => {
            if (ctx && svgImage) {
              const x = image.width - (image.width * 0.2 + 5);
              const y = image.height - (image.width * 0.2 + 5);
              ctx.drawImage(svgImage, x, y, image.width * 0.2, image.width * 0.2);
              const outputImageUrl = canvas.toDataURL('image/png');
              resolve(outputImageUrl);
            } else {
              reject('Error loading SVG');
            }
          };

          svgImage.onerror = () => {
            reject('Error loading SVG');
          };
        } else {
          reject('Error creating canvas context');
        }
      };

      image.onerror = () => {
        reject('Error loading image');
      };
    });
  }





  async generateQR() {
    console.log("generating QR code");
    console.log(this.URLParams.value);
    let url = `http://localhost:4200/location/${this.URLParams.value.location}/${this.URLParams.value.id}`;

    let qrCode = await this.generateQRCode(url);

    console.log(qrCode);

    const imageUrl = 'assets/testDetail/img.jpg';

    this.addSvgToImage(imageUrl, qrCode).then((outputImageUrl) => {
      this.img = outputImageUrl // Output the URL of the output image
      console.log(outputImageUrl);
    }).catch((error) => {
      console.error(error); // Handle any errors that occur
    });

  }

  public downloadImage(): void {
    const link = document.createElement('a');
    link.download = this.test.name;
    link.href = this.img;
    link.click();
  }





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
