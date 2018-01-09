import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { TipoMica, TratamientoMica, Examen } from '../models/examen.models';
import { GenericServiceBase } from '../../generic-catalogs/services/generic.service';
import { FBGenericService } from '../../generic-catalogs/services/fb-generic.service';

@Injectable()
export class TipoMicasService extends FBGenericService implements GenericServiceBase<TipoMica> {
  constructor(_db: AngularFireDatabase) { 
    super(_db);
    super.setListRefURL('micas/tipos');
  }

  newInstance(){
    return new TipoMica();
  }

  //TODO
  mapData(r){
    return this.newInstance();
  }

  setPrecioMicas(listaPreciosID: number, materialID: string, precios: any){
    let $refPrecio = this.db.object(`micas/precios/${listaPreciosID}/${materialID}`);
    $refPrecio.update(precios);
  }

  getPreciosMica(listaPrecioID: number, tipoMicaID: string, materialID: string){
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

  hasChanges(value1: TipoMica, value2: TipoMica){
    return value1.nombre !== value2.nombre 
        || value1.tipoMica !== value2.tipoMica;
  }

  save(_currentValue: TipoMica, _newValue: TipoMica){
    if(this.hasChanges(_currentValue, _newValue))
    {
      _currentValue = Object.assign(_currentValue, _newValue);
      return _currentValue.key ?  this.updateCatalogItem(_currentValue) :  this.addCatalogItem(_currentValue);
    }
  }
}
