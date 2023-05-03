import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {positionService} from "../../service/position.service";
import {WaypointService} from "../../service/http/waypoint.service"
import * as qrcode from 'qrcode';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  @ViewChild('myModal', {static: true}) myModal!: ElementRef<HTMLInputElement>;
  private location: string | undefined;
  private id: number | undefined;

  private URLParams: any;

  test = {
    name: 'SPAI',
    cordinates: '46.2295425892837, 8.74425883677592',
    lat: 46.2295425892837,
    lng: 8.74425883677592,
    description: "Lorem ipsum"
  }

  waypointInfo: any;

  embed: any;

  cord: any;

/*
  showNav = true;
*/
  distance: number | undefined;
  displayedDistance = 0;

  img: any;

  constructor(private route: ActivatedRoute, private positionService: positionService, private waypointService: WaypointService) {
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.URLParams = params;
    });


    console.log("params", this.URLParams.location); // {location: "lugano", id: "1"}

    this.waypointService.getWaypoint(this.URLParams.location, this.URLParams.id).subscribe(waypoint => {
      console.log("waypoint", waypoint)
      this.waypointInfo = waypoint;
      console.log("waypointInfo", this.waypointInfo.locationName)
    });

    //this.URLParams = this.route.snapshot.url.slice(-2).map(segment => segment.path);
    console.log("getting your location: wait...");
    this.cord = await this.positionService.getLocation();
    console.log("location: ", this.cord);
    this.checkDistanceTimer();
  }

  async checkDistanceTimer() {
    //set interval
    let intervalID = setInterval(() => {
      this.cord = this.positionService.getLocationWithoutPromise();
      this.embed = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBJL4FWmG032BG6KXxTb4faxpO_ccyaP3o&origin=${this.cord.lat},${this.cord.lon}&destination=${this.waypointInfo.lat},${this.waypointInfo.lon}`;
      this.myModal.nativeElement.checked = false;
      if (this.cord?.lat && this.cord?.lon) {
        this.distance = this.positionService.getDistanceBetweenCoordinates(this.cord?.lat, this.cord?.lon, this.test.lat, this.test.lng);
        if (this.distance < 0.05) {
          this.generateQR()
          // implement this nex line in angular ts
          this.myModal.nativeElement.checked = true;
        }
      } else {
        this.distance = undefined;
      }
    }, 1000);
  }

  async generateQRCode(url: string) {
    try {
      const string = await qrcode.toString(url, {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {dark: '#000000FF', light: '#FFFFFFFF'}
      });
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

      const svgBlob = new Blob([svgString], {type: 'image/svg+xml'});
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
    link.download = this.waypointInfo.locationName;
    link.href = this.img;
    link.click();
  }

}
