import { Component, OnInit, Input, Inject } from '@angular/core';
import { DetalleCorteCaja } from 'app/modules/venta/models/caja.models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-registrar-corte',
  templateUrl: './registrar-corte.component.html',
  styleUrls: ['./registrar-corte.component.scss']
})
export class RegistrarCorteComponent implements OnInit {

  @Input() detalle: DetalleCorteCaja[];

  constructor(private dialogRef: MatDialogRef<RegistrarCorteComponent>,
    @Inject(MAT_DIALOG_DATA) _detalle: DetalleCorteCaja[]) { 
      this.detalle = _detalle;
    }

  ngOnInit() {
  }

  onContinue(){
    this.dialogRef.close(true);
  }

  onCancelar(){
    this.dialogRef.close(false);
  }
}
