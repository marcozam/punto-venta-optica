import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FBGenericService } from '../../generic-catalogs/services/fb-generic.service';
import { BaseGenericCatalog, GenericCatalog } from '../../generic-catalogs/models/generic-catalogs.models';

@Injectable()
export class CategoriaArmazonService extends FBGenericService {
    constructor(_db: AngularFireDatabase) {
        super(_db);
        super.setListRefURL('armazones/categorias');
    }

    setPrecioCategorias(precios, listaPreciosID){
        let $refPrecio = this.db.object(`armazones/precios/${listaPreciosID}/categorias`);
        $refPrecio.set(precios);
    }

    getPrecioCategoria(listaPreciosID, categoriaID, callback){
        let $refPrecio = this.db.object(`armazones/precios/${listaPreciosID}/categorias/${categoriaID}`).snapshotChanges()
        .map(snap => {
            return { 
                precio : snap.payload.val(),
                key: snap.key
            }
        })
        .subscribe(r=> {
            callback(r);
        });
    }

    getPreciosCategorias(listaPreciosID, callback?, watch?:boolean){
        let $refPrecio = this.db.list(`armazones/precios/${listaPreciosID}/categorias`).snapshotChanges()
            .map((arr) => {
                return arr.map(snap => {
                    return { 
                        precio : snap.payload.val(),
                        key: snap.key
                    }
                });
            })
            .subscribe(r=> {
                if(!watch){
                    $refPrecio.unsubscribe();
                }
                callback(r);
            });
    }
}