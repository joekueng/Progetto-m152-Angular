import { Component } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'm-152';


  constructor(
    private cookieService: CookieService,
    private router: Router,
  ) {
  }

  clearAllCookies() {
    const allCookies = this.cookieService.getAll();
    for (const cookieName in allCookies) {
      this.cookieService.delete(cookieName);
    }
    this.router.navigate(['/login']);
  }
}
