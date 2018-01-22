import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { TipoMica } from '../../models/examen.models';

import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { TipoMicasService, FBTipoMicasService } from '../../services/tipo-micas.service';

@Component({
  selector: 'app-tipo-mica',
  templateUrl: './tipo-mica.component.html',
  styleUrls: ['./tipo-mica.component.scss'],
  providers: [TipoMicasService, DialogBoxService, FBTipoMicasService]
})
export class TipoMicaComponent implements OnInit, OnDestroy {

  catalogID: number = 1102;
  item: TipoMica = new TipoMica();
  
  private loadingSubscription: Subscription;
  isLoading: boolean = false;

  constructor(
    private _tiposervice: TipoMicasService,
    private fb_tiposervice: FBTipoMicasService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: DialogBoxService) { 
      this.loadingSubscription = this._tiposervice.loading$.subscribe(loading=> this.isLoading = loading);
    }

  ngOnInit() {
    let _detailID = this.route.snapshot.params['detailID'];

    if(_detailID !== 'new'){
      this.fb_tiposervice.getCatalogItem(_detailID, (fbItem) => {
        let $sub = this._tiposervice.getByFBKey(_detailID)
          .subscribe(items => {
            if(items.length > 0) this.item = items[0];
            else{
              fbItem.keyFB = fbItem.key;
              fbItem.key = 0;
              this.item = fbItem;
            }
            $sub.unsubscribe();
          })
      });
    }
  }

  ngOnDestroy(){
    this.loadingSubscription.unsubscribe();
  }

  onSave(newValue: TipoMica){
    newValue.keyFB = this.item.keyFB;
    let $sub = this._tiposervice.save(newValue, this.item)
      .subscribe(item=>{
        this.fb_tiposervice.save(item);
        $sub.unsubscribe();
        this.dialog.openDialog('Registro exitoso!', 'La informacion se ha guardado con exito.', false);
        let _url = '/catalogo/' + this.catalogID;
        this.router.navigate([_url]);
      })
  }
}