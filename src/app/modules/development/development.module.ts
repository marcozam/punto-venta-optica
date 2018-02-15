import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { BaseModule } from 'app/modules/base/base.module';
import { DevelopmentRoutingModule } from './development-routing.module';

import { StoreProcedureListComponent } from './components/store-procedure-list/store-procedure-list.component';

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
