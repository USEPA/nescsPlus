import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdvancedQueryRoutingModule} from './advanced-query-routing.module';
import {AdvancedQueryService} from '../services/advanced-query.service';
import {AdvancedQueryComponent} from './advanced-query.component';
import {DataTableComponent} from '../shared/datatable.component';
import {ListComponent} from '../shared/list.component';
import {ToggleItemsComponent} from '../shared/toggle-items/toggle-items.component';
import {ToggleColumnsComponent} from '../shared/toggle-columns/toggle-columns.component';

@NgModule({
  imports: [
    CommonModule,
    AdvancedQueryRoutingModule
  ],
  exports: [
    DataTableComponent,
    ListComponent
  ],
  declarations: [
    AdvancedQueryComponent,
    DataTableComponent,
    ListComponent,
    ToggleItemsComponent,
    ToggleColumnsComponent
  ],
  providers: [
    AdvancedQueryService
  ]
})
export class AdvancedQueryModule {

}



