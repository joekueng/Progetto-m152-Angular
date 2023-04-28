import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {DetailComponent} from "./detail/detail.component";
import {ListComponent} from "./list/list.component";
import {ManagementComponent} from "./management/management.component";


@NgModule({
  imports: [RouterModule.forRoot([
    {path: 'home', component: HomeComponent},
    {path: 'management', component: ManagementComponent},
    {path: 'location/:location', component: ListComponent},
    {path: 'location/:location/:id', component: DetailComponent},
    {path: '**', redirectTo: 'home'}
  ])],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
