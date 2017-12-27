import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from './../components/dialog-box/dialog-box.component';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogBoxService {

  isOpen: boolean = false;

  constructor(public dialog: MatDialog){
  }

  openDialog(_title:string, _mensaje:string, _showButtons:boolean, _onClose?: any){
    this.isOpen = true;
    let dialogRef = this.dialog.open(DialogBoxComponent, {
      data: { title: _title, mensaje: _mensaje, showButtons: _showButtons }
    });

    dialogRef.afterClosed().subscribe(()=>{
      this.isOpen = false;
    })

    if(_onClose){
      dialogRef.afterClosed().subscribe(result => { _onClose(result); });
    }
  }
}