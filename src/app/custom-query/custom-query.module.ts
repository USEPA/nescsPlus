import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomQueryRoutingModule } from './custom-query-routing.module';
import { CustomQueryComponent } from './custom-query.component';

@NgModule({
  imports: [
    CommonModule,
    CustomQueryRoutingModule
  ],
  exports:      [ CustomQueryComponent ],
  declarations: [CustomQueryComponent]
})
export class CustomQueryModule { }
