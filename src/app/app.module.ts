import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './component/list/list.component';
import { DetailComponent } from './component/detail/detail.component';
import {FormsModule} from "@angular/forms";
import { HttpClientModule} from "@angular/common/http";
import { SafePipe } from './pipes/safe.pipe';
import { ManagementComponent } from './component/management/management.component';
import { LoginComponent } from './component/login/login.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListComponent,
    DetailComponent,
    ManagementComponent,
    SafePipe,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
