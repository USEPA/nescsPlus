import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdvancedQueryRoutingModule} from './advanced-query-routing.module';
import {AccordionModule} from 'ngx-bootstrap';
import {AdvancedQueryService} from '../services/advanced-query.service';

@NgModule({
  imports: [
    CommonModule,
    AdvancedQueryRoutingModule,
    AccordionModule
  ],
  exports: [],
  declarations: [],
  providers: [
    AdvancedQueryService
  ]
})
export class AdvancedQueryModule {

}



