import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdvancedQueryComponent} from './advanced-query/advanced-query.component';
import {CustomQueryComponent} from './custom-query/custom-query.component';


const routes: Routes = [
  {path: '', redirectTo: 'advancedQuery', pathMatch: 'full'},
  // {path: 'advancedQuery', component: AdvancedQueryComponent},
  // {path: 'customQuery', component: CustomQueryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
