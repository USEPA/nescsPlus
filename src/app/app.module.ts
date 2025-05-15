import {BrowserModule} from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, inject, provideAppInitializer } from '@angular/core';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';


/* Routing Module */
import {AppRoutingModule} from './app-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {AppService} from './services/app.service';
import {AppLoadService} from './services/app-load.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ApplicationModule} from './application/application.module';
import {HelpComponent} from './modals/help/help.component';
import {SplashEntryModalComponent} from './modals/splash-entry-modal/splash-entry-modal.component';
import { SplashEntryCustomModalComponent } from './modals/splash-entry-custom-modal/splash-entry-custom-modal.component';

export function get_settings(appLoadService: AppLoadService) {
  return () => appLoadService.getSettings();
}

@NgModule({ declarations: [
        AppComponent,
        PageNotFoundComponent,
        HelpComponent,
        SplashEntryModalComponent,
        SplashEntryCustomModalComponent
    ],
    exports: [],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA], imports: [BrowserModule,
        AppRoutingModule,
        ApplicationModule,
        FormsModule,
        ModalModule.forRoot(),
        BrowserAnimationsModule,
        ApplicationModule], providers: [
        AppLoadService,
        provideAppInitializer(() => {
        const initializerFn = (get_settings)(inject(AppLoadService));
        return initializerFn();
      }),
        AppService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {
}
