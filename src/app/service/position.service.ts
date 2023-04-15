import {Injectable} from '@angular/core';
import{Cord} from "../interface/cord";

@Injectable({
  providedIn: 'root'
})
export class positionService{
  cord: Cord = { lat: 0, lon: 0 };

  /*getDistanceBetweenCoordinates(lat1: number | undefined, lon1: number | undefined, lat2: number, lon2: number) {
    if (lat1 === undefined || lon1 === undefined) {
      console.log('lat1 or lon1 is undefined')
      return 0;
    }else{
      const earthRadius = 6371; // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      // Distance in km
      return earthRadius * c;
    }
  }*/

  getDistanceBetweenCoordinates(lat1: number | undefined, lon1: number | undefined, lat2: number, lon2: number) {
    if (lat1 === undefined || lon1 === undefined) {
      console.log('lat1 or lon1 is undefined')
      return 0;
    }
    const earthRadius = 6371; // Raggio della Terra in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c; // Distanza in km
    return distance;
  }


  deg2rad(deg: number) {
    return deg * (Math.PI / 180)
  }

  async getLocation() {
    console.log('get location');
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.cord = { lat, lon };
          console.log(this.cord);
          resolve(this.cord);
        }, (error) => {
          reject(error);
        });
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

}
