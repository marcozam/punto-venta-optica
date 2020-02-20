import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SucursalService } from 'app/services/http';
import { Sucursal } from 'app/modules/generic-catalogs/models';

@Component({
  templateUrl: './sucursal-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SucursalSelectionComponent implements OnInit {

  sucursales: any[] = [];

  constructor(private sucursalService: SucursalService) {}

  ngOnInit() {
    this.sucursalService.getList()
      .subscribe(list => {
        console.log('sucursales', list);
        this.sucursales = list;
      });
  }

  select(sucursal: Sucursal) {

  }
}
