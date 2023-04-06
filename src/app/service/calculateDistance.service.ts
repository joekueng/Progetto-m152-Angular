import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculateDistanceService{
  getDistanceBetweenCoordinates(lat1: number, lon1: number, lat2: number, lon2: number) {
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

  deg2rad(deg: number) {
    return deg * (Math.PI / 180)
  }

}
