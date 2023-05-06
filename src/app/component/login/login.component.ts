import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "../../service/language/translate.service";
import {ReadTranslateJsonService} from "../../service/language/readTranslateJson.service";
import {cookieService} from "../../service/cookie.service";
import {UserService} from "../../service/http/user.service";
import {UserEntity} from "../../interface/UserEntity";
import {loginTranslations} from "../../interface/translations";

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
  loginTranslation: loginTranslations = {} as loginTranslations;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private readTranslationJsonService: ReadTranslateJsonService,
    private userService: UserService,
    private cookieService: cookieService,
  ) {
  }

  ngOnInit(): void {
    this.loginTranslation = this.readTranslationJsonService.getLoginTranslations();
  }

  createNewUser(createUser: UserEntity) {
    console.log(createUser.username+" "+createUser.password);
    if (createUser.username == '' || createUser.password == '') {
      this.errorCreateUser = true;
      return;
    }
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].username == createUser.username) {
          this.errorCreateUser = true;
        }
      }
      this.newUser.username = createUser.username;
      this.newUser.password = createUser.password;
      this.userService.createUser(this.newUser).subscribe(user => {
        this.cookieService.setUsername(createUser.username);
        this.router.navigate(['/home']);
      });
    });
  }

  loginFunction(username: string, password: string) {
    this.userService.getUser(username).subscribe(user => {
      console.log(user);
      if (user !== null) {
        if (user.password == password) {
          this.cookieService.setUsername(username);
          this.router.navigate(['/home']);
        }else {
          this.errorLogin = true;
        }
      } else {
        this.errorLogin = true;
      }
    });
  }

  submit() {
    if (this.login) {
      this.loginFunction(this.newUser.username, this.newUser.password);
    } else {
      this.createNewUser(this.newUser);
    }
  }

  switch() {
    this.errorCreateUser = false;
    this.errorLogin = false;
    if (this.login) {
      this.login = false;
    } else {
      this.login = true;
    }
  }
}
