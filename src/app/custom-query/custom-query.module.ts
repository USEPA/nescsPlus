import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {CustomQueryRoutingModule} from './custom-query-routing.module';
import {CustomQueryComponent} from './custom-query.component';
import {NgSelect2Module} from 'ng-select2';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CustomQueryRoutingModule,
    NgSelect2Module
  ],
  exports: [CustomQueryComponent],
  declarations: [CustomQueryComponent]
})
export class CustomQueryModule {
}
