import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
// Services
import { SucursalService } from 'app/services/http';
import { ApplicationService } from 'app/services';
// Models
import { Sucursal } from 'models';

@Component({
  templateUrl: './sucursal-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SucursalSelectionComponent implements OnInit {

  sucursales: Sucursal[] = [];

  constructor(private sucursalService: SucursalService,
    private applicationService: ApplicationService,
    public dialogRef: MatDialogRef<SucursalSelectionComponent>) {}

  ngOnInit() {
    this.sucursalService.getList()
      .subscribe(list => {
        if (list.length === 1) {
          this.select(list[0]);
        }
        this.sucursales = list;
      });
  }

  select(sucursal: Sucursal) {
    if (sucursal) {
      this.applicationService.setSucursal(sucursal);
      this.dialogRef.close();
    }
  }
}
