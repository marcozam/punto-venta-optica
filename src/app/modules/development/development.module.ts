import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseModule } from 'app/modules/base/base.module';
import { DevelopmentRoutingModule } from './development-routing.module';

import { StoreProcedureListComponent } from './components/store-procedure-list/store-procedure-list.component';
import { MatDialogModule, MatButtonModule, MatIconModule, MatSelectModule, MatTooltipModule, MatProgressBarModule, } from '@angular/material';

@NgModule({
  imports: [
    DevelopmentRoutingModule,
    CommonModule,
    BaseModule,
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSelectModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  declarations: [StoreProcedureListComponent]
})
export class DevelopmentModule { }
