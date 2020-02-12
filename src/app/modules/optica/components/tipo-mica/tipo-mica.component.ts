import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { TipoMica } from '../../models/examen.models';

import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { TipoMicasService } from '../../services/tipo-micas.service';

import { SuccessTitle, SuccessMessage } from 'app/modules/base/constants/messages.contants';

@Component({
  selector: 'app-tipo-mica',
  templateUrl: './tipo-mica.component.html',
  styleUrls: ['./tipo-mica.component.scss'],
  providers: [TipoMicasService, DialogBoxService]
})
export class TipoMicaComponent implements OnInit, OnDestroy {

  catalogID = 1102;
  item: TipoMica = new TipoMica();

  private loadingSubscription: Subscription;
  isLoading = false;

  constructor(
    private _tiposervice: TipoMicasService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: DialogBoxService) {
      this.loadingSubscription = this._tiposervice.loading$.subscribe(loading => this.isLoading = loading);
    }

  ngOnInit() {
    const _detailID = this.route.snapshot.params['detailID'];
    if (_detailID > 0) {
      const $sub = this._tiposervice.getByID(_detailID).subscribe(item => {
          this.item = item;
          $sub.unsubscribe();
        });
    }
  }

  ngOnDestroy() { this.loadingSubscription.unsubscribe(); }

  onSave(newValue: TipoMica) {
    newValue.keyFB = this.item.keyFB;
    const $sub = this._tiposervice.save(newValue, this.item)
      .subscribe(() => {
        $sub.unsubscribe();
        this.dialog.openDialog(SuccessTitle, SuccessMessage, false);
        const _url = '/DCG/catalogo/' + this.catalogID;
        this.router.navigate([_url]);
      });
  }
}
