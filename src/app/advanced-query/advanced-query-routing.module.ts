import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdvancedQueryComponent} from './advanced-query.component';

const routes: Routes = [
  { path: 'advancedQuery', component: AdvancedQueryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvancedQueryRoutingModule { }
