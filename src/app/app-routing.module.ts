import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SplashScreenComponent} from './splash-screen/splash-screen.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';


const routes: Routes = [
  {path: '', redirectTo: '/application/multipleQuery', pathMatch: 'full'},
  {path: 'splash', component: SplashScreenComponent},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
