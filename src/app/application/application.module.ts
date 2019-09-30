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
    ToggleColumnsComponent
  ],
  entryComponents: [
    DeleteModalComponent,
    NameModalComponent,
    SearchInstructionsModalComponent
  ],
  exports: [
    DataTableComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ApplicationRoutingModule,
    NgSelectModule
  ]
})
export class ApplicationModule {
}
