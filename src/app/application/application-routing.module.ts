import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SplashService} from '../services/splash.service';
import {ApplicationComponent} from './application.component';
import {AdvancedQueryComponent} from '../advanced-query/advanced-query.component';
import {CustomQueryComponent} from '../custom-query/custom-query.component';
import {NgSelectModule} from '@ng-select/ng-select';


const routes: Routes = [
  {
    path: 'application',
    canActivate: [SplashService],
    component: ApplicationComponent,
    children: [
      {
        path: 'multipleQuery',
        component: AdvancedQueryComponent
      },
      {
        path: 'singleQuery',
        component: CustomQueryComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgSelectModule
  ],
  exports: [RouterModule]
})
export class ApplicationRoutingModule {
}
