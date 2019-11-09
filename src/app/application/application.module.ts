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
import {NgSelectModule} from '@ng-select/ng-select';
import {NameModalComponent} from '../modals/name-modal/name-modal.component';
import {DeleteModalComponent} from '../modals/delete-modal/delete-modal.component';
import {SearchInstructionsModalComponent} from '../modals/search-instructions-modal/search-instructions-modal.component';
import {ExcelService} from '../services/excel.service';
import {AdvancedQueryService} from '../services/advanced-query.service';
import {SingleQueryTableComponent} from '../custom-query/single-query-table/single-query-table.component';
import {HelpComponent} from '../modals/help/help.component';


@NgModule({
  declarations: [
    NameModalComponent,
    DeleteModalComponent,
    SearchInstructionsModalComponent,
    ApplicationComponent,
    AdvancedQueryComponent,
    CustomQueryComponent,
    DataTableComponent,
    ListComponent,
    ToggleItemsComponent,
    ToggleColumnsComponent,
    SingleQueryTableComponent
  ],
  entryComponents: [
    DeleteModalComponent,
    NameModalComponent,
    SearchInstructionsModalComponent,
    HelpComponent
  ],
  exports: [
    DataTableComponent,
    SingleQueryTableComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ApplicationRoutingModule,
    NgSelectModule
  ],
  providers: [
    ExcelService,
    AdvancedQueryService
  ]
})
export class ApplicationModule {
}
