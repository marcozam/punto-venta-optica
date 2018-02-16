import { Injectable } from '@angular/core';
// FireBase
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
// Service
import { FBGenericService } from '../../generic-catalogs/services/fb-generic.service';
// Models
import { CategoriaArmazon } from '../models/armazon.models';

@Injectable()
export class CategoriaArmazonService extends FBGenericService<CategoriaArmazon> {
    constructor(_db: AngularFireDatabase) {
        super(_db);
        super.setListRefURL('/armazones/categorias');
    }

    newInstance() { return new CategoriaArmazon(); }

    mapPrecioData(snap: AngularFireAction<any>) {
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
}
