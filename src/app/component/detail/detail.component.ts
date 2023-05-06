import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import {ActivatedRoute} from "@angular/router";
import {positionService} from "../../service/position.service";
import {WaypointService} from "../../service/http/waypoint.service"
import {WaypointVisitedService} from "../../service/http/waypointVisited.service"
import {detailTranslations} from "../../interface/translations";
import * as qrcode from 'qrcode';
import {WaypointsVisitedEntity} from "../../interface/WaypointsVisitedEntity";
import {ReadTranslateJsonService} from "../../service/language/readTranslateJson.service";
import {CookieService} from "ngx-cookie-service";
import {UserService} from "../../service/http/user.service";
import {UserEntity} from "../../interface/UserEntity";

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
  waypointInfo: any;
  embed: any;
  cord: any;

  detailTranslations: detailTranslations = {} as detailTranslations;

  /*
    showNav = true;
  */
  distance: number | undefined;
  displayedDistance = 0;

  img: any;

  iframeLoded: boolean = false;

  constructor(private route: ActivatedRoute, private positionService: positionService, private waypointService: WaypointService, private waypointVisitedService: WaypointVisitedService, private readTranslationJsonService: ReadTranslateJsonService,
  private userService: UserService, private cookieService: CookieService, private router: Router) {

  }

  async ngOnInit() {
    this.detailTranslations = this.readTranslationJsonService.getDetailTranslations();
    this.route.params.subscribe(params => {
      this.URLParams = params;
      console.log("params", params);
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
    console.log(this.isIframeLoaded('map'))
  }

  isIframeLoaded(iframeId: string): boolean {
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    if (!iframe) {
      throw new Error(`Iframe with ID ${iframeId} not found`);
    } else if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
      return true;
    } else {
      return false;
    }
  }


  async checkDistanceTimer() {
    //set interval
    let intervalID = setInterval(() => {
      this.cord = this.positionService.getLocationWithoutPromise();
      this.embed = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBJL4FWmG032BG6KXxTb4faxpO_ccyaP3o&origin=${this.cord.lat},${this.cord.lon}&destination=${this.waypointInfo?.lat},${this.waypointInfo?.lon}`;
      this.myModal.nativeElement.checked = false;
      if (this.cord && this.waypointInfo && this.cord?.lat && this.cord?.lon && this.waypointInfo?.lat && this.waypointInfo?.lon) {
        this.distance = this.positionService.getDistanceBetweenCoordinates(this.cord?.lat, this.cord?.lon, this.waypointInfo.lat, this.waypointInfo.lon);
        if (this.distance < 0.05) {
          this.generateQR()

          // implement this nex line in angular ts
          this.myModal.nativeElement.checked = true;
          this.userService.getUser("tito").subscribe(user => {
            if (user?.id !== undefined) {
              let waypointVisited: WaypointsVisitedEntity = {userId: user.id , waypointId: this.waypointInfo.id}
              console.log("waypointVisited", waypointVisited)
            this.waypointVisitedService.createWaypoint(waypointVisited)
            }
          })
        } else {
          this.myModal.nativeElement.checked = false;
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
  async addSvgToImage(imageUrl: string, svgString: string): Promise<string> {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;

    const svgBlob = new Blob([svgString], {type: 'image/svg+xml'});
    const svgUrl = URL.createObjectURL(svgBlob);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }

    try {
      await new Promise((resolve, reject) => {
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;

          ctx.drawImage(image, 0, 0);
          const svgImage = new Image();

          svgImage.crossOrigin = 'anonymous';
          svgImage.src = svgUrl;

          svgImage.onload = () => {
            const x = image.width - (image.width * 0.2 + 5);
            const y = image.height - (image.width * 0.2 + 5);
            ctx.drawImage(svgImage, x, y, image.width * 0.2, image.width * 0.2);

            const outputImageUrl = canvas.toDataURL('image/png');
            resolve(outputImageUrl);
          };

          svgImage.onerror = () => {
            reject('Error loading SVG');
          };
        };

        image.onerror = () => {
          reject('Error loading image');
        };
      });
    } catch (err) {
      console.error(err);
    }

    return canvas.toDataURL('image/png');
  }



  async generateQR() {
    console.log("generating QR code");
    //console.log(this.URLParams.value);
    let url = `http://localhost:4200/location/${this.URLParams.location}/${this.URLParams.id}`;

    let qrCode = await this.generateQRCode(url);

    //console.log(qrCode);

    const imageUrl = this.waypointInfo.img;

    this.addSvgToImage(imageUrl, qrCode).then((outputImageUrl) => {
      this.img = outputImageUrl // Output the URL of the output image
      //console.log(outputImageUrl);
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

  public closeModal(): void {
    this.myModal.nativeElement.checked = false;
    this.router.navigate(['/location/', this.URLParams.location]);
  }

}
