import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { TipoMica } from '../../models/examen.models';

import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { TipoMicasService } from '../../services/tipo-micas.service';

@Component({
  selector: 'app-tipo-mica',
  templateUrl: './tipo-mica.component.html',
  styleUrls: ['./tipo-mica.component.scss'],
  providers: [TipoMicasService, DialogBoxService]
})
export class TipoMicaComponent implements OnInit {

  catalogID: string = '1';
  isLoading: boolean = true;
  item: TipoMica = new TipoMica();

  constructor(private _tiposervice: TipoMicasService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: DialogBoxService) { }

  ngOnInit() {
    let _detailID = this.route.snapshot.params['detailID'];
    if(_detailID !== 'new'){
      this._tiposervice.getCatalogItem(_detailID, (r=>{
        this.isLoading = false;
        this.item = r;
      }))
    }
    else{
      this.isLoading = false;
    }
  }

  onSave(newValue: TipoMica){
    this._tiposervice.save(this.item, newValue);
    this.dialog.openDialog('Registro exitoso!', 'La informacion se ha guardado con exito.', false);
    let _url = '/catalogo/' + this.catalogID;
    this.router.navigate([_url]);
  }
}
