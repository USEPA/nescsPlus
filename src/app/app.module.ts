import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';


/* Routing Module */
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {AppService} from './services/app.service';
import {AppLoadService} from './services/app-load.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AdvancedQueryModule} from './advanced-query/advanced-query.module';
import {CustomQueryModule} from './custom-query/custom-query.module';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';

export function get_settings(appLoadService: AppLoadService) {
  return () => appLoadService.getSettings();
}

@NgModule({
  declarations: [
    AppComponent,
    SplashScreenComponent
  ],
  exports: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AdvancedQueryModule,
    CustomQueryModule,
    FormsModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    AppLoadService,
    {provide: APP_INITIALIZER, useFactory: get_settings, deps: [AppLoadService], multi: true},
    AppService],
  bootstrap: [AppComponent],
  schemas:[NO_ERRORS_SCHEMA]
})
export class AppModule {
}
