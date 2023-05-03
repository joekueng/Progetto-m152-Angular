import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {DetailComponent} from "./component/detail/detail.component";
import {ListComponent} from "./component/list/list.component";
import {ManagementComponent} from "./component/management/management.component";
import {LoginComponent} from "./component/login/login.component";

@NgModule({
  imports: [RouterModule.forRoot([
    {path: 'home', component: HomeComponent},
    {path: 'management', component: ManagementComponent},
    {path: 'location/:location', component: ListComponent},
    {path: 'location/:location/:id', component: DetailComponent},
    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo: 'home'},
  ])],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
