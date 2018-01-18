import { TratamientoMicasService } from './tratamiento-micas.service';
import { MaterialMicasService } from './material-micas.service';
import { TipoMicasService } from './tipo-micas.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

//Models
import { GenericCatalog } from 'app/modules/base/models/base.models';
import * as ExamenModels from '../models/examen.models';
import { Producto } from '../../producto/models/producto.models';
import { DetalleVenta } from '../../venta/models/venta.models';

@Injectable()
export class ExamenService {
    referenceURL: string;
    referenceMicasURL: string;
    
    constructor(private db: AngularFireDatabase) {
        this.referenceMicasURL = '/micas';
        this.referenceURL = '/examenes';
    }

    private getItemsList(type:string, callback: any){
        let $ref = this.db.list(`${this.referenceMicasURL}/${type}`)
            .snapshotChanges()
            .map(arr => {
                return arr.map(snap => {
                    return Object.assign(new GenericCatalog(), snap.payload.val(), { key: snap.key });
                });
            })
            .subscribe(r => {
                callback(r);
                $ref.unsubscribe();
            });
    }

    getLastExamen(idPaciente:any){
        return this.db.object(`${this.referenceURL}/${idPaciente}/last`)
            .valueChanges();
    }

    saveExamen(idPaciente:any, examen: ExamenModels.Examen){
        let $refHist = this.db.list(`${this.referenceURL}/${idPaciente}/history`);
        let $refLast = this.db.object(`${this.referenceURL}/${idPaciente}/last`);
        
        //Post data
        $refLast.set(examen);
        return $refHist.push(examen).key;
    }
}