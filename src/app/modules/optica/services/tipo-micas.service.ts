import { Injectable } from '@angular/core';
// Models
import { TipoMica } from '../models/examen.models';
import { FieldProperty } from 'app/modules/generic-catalogs/models/generic-catalogs.models';
// Services
import { GenericServiceBase, GenericService } from '../../generic-catalogs/services/generic.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

@Injectable()
export class TipoMicasService extends GenericService<TipoMica> implements GenericServiceBase<TipoMica> {

  catalogID = 1102;

  constructor(_db: BaseAjaxService) {
    super(_db, 'os_optica_tipo_mica', 480);
  }

  mapList(list: any[]) {
    const iList = super.mapList(list);
    let respond: TipoMica[] = iList.filter(d => d.tipoMica === 1);
    respond = respond.concat(iList.filter(d => d.tipoMica === 0));
    respond = respond.concat(iList.filter(d => d.tipoMica === 2));
    return respond;
  }

  newInstance() { return new TipoMica(); }

  getByFBKey(key: string) {
    const fmd: FieldProperty = TipoMica.prototype['keyFB__dbData'];
    return this.db.getAllDataFromCatalog(this.catalogID, `${fmd.key},${key}`)
      .map(result => result.map(it => this.mapData(it)));
  }
}

/*
@Injectable()
export class FBTipoMicasService extends FBGenericService<TipoMica> implements GenericServiceBase<TipoMica> {
  constructor(_db: AngularFireDatabase) {
    super(_db);
    super.setListRefURL('micas/tipos');
  }

  newInstance(){ return new TipoMica(); }

  setPrecioMicas(listaPreciosID: number, materialID: any, precios: any){
    let $refPrecio = this.db.object(`micas/precios/${listaPreciosID}/${materialID}`);
    $refPrecio.update(precios);
  }

  getPreciosMica(listaPrecioID: number, tipoMicaID: any, materialID: any){
    return this.db.object(`micas/precios/${listaPrecioID}/${materialID}/${tipoMicaID}`)
      .snapshotChanges()
      .map(snap => {
        return Object.assign(snap.payload.val(), { key: snap.key });
      });
  }

  getPrecioMica(examen: Examen, precio): number{
    let _precioBase = precio.precioBase + 270;
    //Revisa si la mica es Cilindrica
    if(examen.ojoDerecho.cilindro !== 0 || examen.ojoIzquierdo.cilindro !== 0){
      //TODO: Obtener el precio de la mica cilindrica
      _precioBase += 150;
    }
    //Calcula Dioptrias adicionales
    //TODO: Obtener datos de la BD
    let _maximoDioptrias: number = 3;
    let _precioDioptria: number = 15;
    let _dioptrias:number = Math.max(
      Math.abs(examen.ojoDerecho.esfera),
      Math.abs(examen.ojoIzquierdo.esfera),
      Math.abs(examen.ojoDerecho.cilindro),
      Math.abs(examen.ojoIzquierdo.cilindro),
    );
    if(_dioptrias > _maximoDioptrias){
      _precioBase += ((_dioptrias - _maximoDioptrias)/.25) * _precioDioptria;
    }
    return _precioBase;
  }

  getAllMicasPrecios(listaPrecioID: number, materialID: string, callback: any){
    let $ref = this.db.list(`micas/precios/${listaPrecioID}/${materialID}`)
      .snapshotChanges()
      .map(arr => {
        return arr.map(snap => {
          return Object.assign(snap.payload.val(), { key: snap.key });
        })
      })
      .subscribe((data: any) => {
        callback(data);
        $ref.unsubscribe();
      });
  }

  save(_newValue: TipoMica){
    return _newValue.key ?  this.updateCatalogItem(_newValue) :  this.addCatalogItem(_newValue);
  }
}
*/
