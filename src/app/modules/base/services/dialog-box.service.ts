import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './../components/dialog-box/dialog-box.component';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogBoxService {
  isOpen = false;
  constructor(public dialog: MatDialog) { }

  openDialog(_title: string, _mensaje: string, _showButtons: boolean = false, _onClose?: any) {
    this.isOpen = true;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: { title: _title, mensaje: _mensaje, showButtons: _showButtons }
    });
    dialogRef.afterClosed().subscribe(() => { this.isOpen = false; });
    if (_onClose) { dialogRef.afterClosed().subscribe(result => { _onClose(result); }); }
  }
}
