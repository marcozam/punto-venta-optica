import { Injectable } from '@angular/core';
// Service
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { GenericService } from 'app/modules/generic-catalogs/services/generic.service';
// Models
import { CategoriaArmazon } from '../models/armazon.models';

// This service is not on SQL
@Injectable()
export class CategoriaArmazonService extends GenericService<CategoriaArmazon> {
    constructor(_db: BaseAjaxService) {
      super(_db);
    }

    newInstance() { return new CategoriaArmazon(); }
    /*

    mapPrecioData(snap: any) {
      return { precio : snap.payload.val(), key: snap.key };
    }

    setPrecioCategorias(precios, listaPreciosID) {
      const $refPrecio = this.db.object(`armazones/precios/${listaPreciosID}/categorias`);
      $refPrecio.set(precios);
    }

    getPrecioCategoria(listaPreciosID, categoriaID, callback) {
        const $refPrecio = this.db.object(`armazones/precios/${listaPreciosID}/categorias/${categoriaID}`).snapshotChanges()
        .map(snap => this.mapPrecioData(snap))
        .subscribe(r => {
            $refPrecio.unsubscribe();
            callback(r);
        });
    }

    getPreciosCategorias(listaPreciosID, callback?, watch?: boolean) {
        const $refPrecio = this.db.list(`armazones/precios/${listaPreciosID}/categorias`).snapshotChanges()
            .map((arr) => arr.map(snap => this.mapPrecioData(snap)))
            .subscribe(r => {
                if (!watch) { $refPrecio.unsubscribe(); }
                callback(r);
            });
    }
    */
}
