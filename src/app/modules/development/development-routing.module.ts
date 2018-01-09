import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreProcedureListComponent } from './components/store-procedure-list/store-procedure-list.component';

const routes: Routes = [
  { path: 'SP', component: StoreProcedureListComponent, data: { title: 'Store Procedures' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevelopmentRoutingModule { }
