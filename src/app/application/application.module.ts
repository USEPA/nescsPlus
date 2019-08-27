import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {ApplicationRoutingModule} from './application-routing.module';
import {ApplicationComponent} from './application.component';
import {AdvancedQueryComponent} from '../advanced-query/advanced-query.component';
import {CustomQueryComponent} from '../custom-query/custom-query.component';
import {DataTableComponent} from '../shared/datatable.component';
import {ListComponent} from '../shared/list.component';
import {ToggleItemsComponent} from '../shared/toggle-items/toggle-items.component';
import {ToggleColumnsComponent} from '../shared/toggle-columns/toggle-columns.component';
import {NgSelect2Module} from 'ng-select2';


@NgModule({
  declarations: [
    ApplicationComponent,
    AdvancedQueryComponent,
    CustomQueryComponent,
    DataTableComponent,
    ListComponent,
    ToggleItemsComponent,
    ToggleColumnsComponent
  ],
  exports: [
    DataTableComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ApplicationRoutingModule,
    NgSelect2Module
  ]
})
export class ApplicationModule {
}
