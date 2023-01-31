import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {DetailComponent} from "./detail/detail.component";


@NgModule({
  imports: [RouterModule.forRoot([
    {path: 'home', component: HomeComponent},
    {path: 'detail', component: DetailComponent},
    {path: '**', redirectTo: 'home'}
  ])],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
