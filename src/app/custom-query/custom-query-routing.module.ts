import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomQueryComponent} from './custom-query.component';

const routes: Routes = [
  { path: 'customQuery', component: CustomQueryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomQueryRoutingModule { }
