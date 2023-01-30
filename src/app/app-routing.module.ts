import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';


@NgModule({
  imports: [RouterModule.forRoot([
    {path: 'home', component: HomeComponent},
    {path: '**', redirectTo: 'home'}
  ])],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
