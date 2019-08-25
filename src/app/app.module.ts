import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {NgSelect2Module} from 'ng-select2';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';


/* Routing Module */
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {AppService} from './services/app.service';
import {AdvancedQueryComponent} from './advanced-query/advanced-query.component';
import {CustomQueryComponent} from './custom-query/custom-query.component';
import {AppLoadService} from './services/app-load.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ListComponent} from './shared/list.component';
import {DataTableComponent} from './shared/datatable.component';
import { ToggleItemsComponent } from './shared/toggle-items/toggle-items.component';
import { ToggleColumnsComponent } from './shared/toggle-columns/toggle-columns.component';

export function get_settings(appLoadService: AppLoadService) {
  return () => appLoadService.getSettings();
}

@NgModule({
  declarations: [
    AppComponent,
    AdvancedQueryComponent,
    CustomQueryComponent,
    ListComponent,
    DataTableComponent,
    ToggleItemsComponent,
    ToggleColumnsComponent
  ],
  exports: [ListComponent, DataTableComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    NgSelect2Module,
    BrowserAnimationsModule
  ],
  providers: [
    AppLoadService,
    {provide: APP_INITIALIZER, useFactory: get_settings, deps: [AppLoadService], multi: true},
    AppService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
