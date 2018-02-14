import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { FBGenericService } from '../../generic-catalogs/services/fb-generic.service';
import { BaseGenericCatalog, GenericCatalog } from 'app/modules/base/models/base.models';

@Injectable()
export class CategoriaArmazonService extends FBGenericService<GenericCatalog> {
    constructor(_db: AngularFireDatabase) {
        super(_db);
        super.setListRefURL('armazones/categorias');
    }

    mapData(snap: AngularFireAction<any>) {
        console.log(snap.payload.val());
        return { precio : snap.payload.val(), key: snap.key };
    }

    setPrecioCategorias(precios, listaPreciosID) {
        const $refPrecio = this.db.object(`armazones/precios/${listaPreciosID}/categorias`);
        $refPrecio.set(precios);
    }

    getPrecioCategoria(listaPreciosID, categoriaID, callback) {
        const $refPrecio = this.db.object(`armazones/precios/${listaPreciosID}/categorias/${categoriaID}`).snapshotChanges()
        .map(snap => this.mapData(snap))
        .subscribe(r => { callback(r); });
    }

    getPreciosCategorias(listaPreciosID, callback?, watch?: boolean) {
        const $refPrecio = this.db.list(`armazones/precios/${listaPreciosID}/categorias`).snapshotChanges()
            .map((arr) => arr.map(snap => ({ precio : snap.payload.val(), key: snap.key })))
            .subscribe(r => {
                if (!watch) { $refPrecio.unsubscribe(); }
                callback(r);
            });
    }
}
