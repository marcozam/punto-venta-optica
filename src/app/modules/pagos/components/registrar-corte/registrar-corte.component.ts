import { Component, Input, Inject } from '@angular/core';
import { DetalleCorteCaja } from '../../models/caja.models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-registrar-corte',
  templateUrl: './registrar-corte.component.html',
  styleUrls: ['./registrar-corte.component.scss']
})
export class RegistrarCorteComponent {

  @Input() detalle: DetalleCorteCaja[];

  constructor(private dialogRef: MatDialogRef<RegistrarCorteComponent>,
    @Inject(MAT_DIALOG_DATA) _detalle: DetalleCorteCaja[]) {
      this.detalle = _detalle;
    }

  onContinue() { this.dialogRef.close(true); }

  onCancelar() { this.dialogRef.close(false); }
}
