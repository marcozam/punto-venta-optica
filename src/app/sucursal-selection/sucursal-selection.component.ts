import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SucursalService } from 'app/services/http';

@Component({
  templateUrl: './sucursal-selection.component.html'
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
}
