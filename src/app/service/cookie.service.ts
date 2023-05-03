import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class cookieService {

  constructor(
    private coockieService: CookieService,
    private router: Router,
  ) {
  }

  setUsername(username: string): void {
    this.coockieService.set('username', username);
  }

  getUsername(): string {
    let username = this.coockieService.get('username');
    if (username == '' || username == undefined) {
      this.router.navigate(['/login']).then(r => console.log("redirect to login"));
      return '';
    } else {
      return username;
    }
  }

  deleteUsername(): void {
    this.coockieService.delete('username');
  }

}
