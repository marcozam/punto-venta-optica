import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogActionsComponent } from '../../components/dialog-actions/dialog-actions.component'
import { Contacto } from '../../modules/crm/models/crm.models';
import { ContactoService } from 'app/modules/crm/services/contacto.service';

@Component({
  selector: 'home-app',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ContactoService]
})
export class HomeComponent {

  constructor(
    public dialog: MatDialog, 
    private _route: Router,
    private _contactoService: ContactoService){

  }

  onPersonaChange(item: any){
    if(item.data.key === 0){
      this._contactoService.save(item.data, (data: Contacto) => {
        this.openDialog(data);
      });
    }
    else{
      if(item.exist) {
        this.openDialog(item.data);
      }
      else {
        this._route.navigateByUrl('/examen/' + item.data.key)
      }
    }
  }

  openDialog(_contacto: Contacto, _onClose?: any){
    let dialogRef = this.dialog.open(DialogActionsComponent, {
      data: { 
        title: _contacto.nombre, 
        actions: [
          { 
            name: 'Realizar examen',
            route: '/examen/' + _contacto.key
          },
          { 
            name: 'Generar venta',
            route: '/ventas/' + _contacto.key
          }
          /*,
          { 
            name: 'Ordenes pendientes',
            route: '/ventas/' + _contacto.key
          },
          { 
            name: 'Historial de Compra',
            route: '/ventas/' + _contacto.key
          }*/
        ]}
    });

    if(_onClose){
      dialogRef.afterClosed().subscribe(result => { _onClose(result); });
    }
  }
}