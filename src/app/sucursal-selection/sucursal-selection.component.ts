import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SucursalService } from 'app/services/http';

@Component({
  templateUrl: './sucursal-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SucursalSelectionComponent implements OnInit {

  sucursales$: any;

  constructor(private sucursalService: SucursalService) {}

  ngOnInit() {
    this.sucursales$ = this.sucursalService.getList();
  }
}
