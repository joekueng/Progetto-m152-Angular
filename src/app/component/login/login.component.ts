import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "../../service/language/translate.service";
import {ReadTranslateJsonService} from "../../service/language/readTranslateJson.service";
import {cookieService} from "../../service/cookie.service";
import {UserService} from "../../service/http/user.service";
import {UserEntity} from "../../interface/UserEntity";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  newUser: { username: string; password: string; } = {username: '', password: ''};
  username: string = '';
  users: UserEntity[] | undefined;
  login: boolean = true;
  errorCreateUser: boolean = false;
  errorLogin: boolean = false;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private readTranslationJsonService: ReadTranslateJsonService,
    private userService: UserService,
    private cookieService: cookieService,
  ) {
  }

  ngOnInit(): void {
    if (this.cookieService.getUsername() != null) {
      this.router.navigate(['/home']);
    }
  }

  createNewUser(username: string, password: string) {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].username == username) {
          this.errorCreateUser = true;
        }
      }
      this.newUser.username = username;
      this.newUser.password = password;
      this.userService.createUser(this.newUser).subscribe(user => {
        this.cookieService.setUsername(username);
        this.router.navigate(['/management']);
      });
    });
  }

  loginFunction(username: string, password: string) {
    this.userService.getUser(username).subscribe(user => {
      if (user.password == password) {
        this.cookieService.setUsername(username);
        this.router.navigate(['/management']);
      } else {
        this.errorLogin = true;
      }
    });
  }

  switch() {
    if (this.login) {
      this.login = false;
    } else {
      this.login = true;
    }
  }
}
