import { Injectable } from '@angular/core';

import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { GenericService } from 'app/modules/generic-catalogs/services/generic.service';
import { TratamientoMicasService } from './tratamiento-micas.service';
import { MaterialMicasService } from './material-micas.service';
import { TipoMicasService } from './tipo-micas.service';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

//Models
import { GenericCatalog } from 'app/modules/base/models/base.models';
import { Producto } from '../../producto/models/producto.models';
import { DetalleVenta } from '../../venta/models/venta.models';
import { Examen, Ojo } from '../models/examen.models';

@Injectable()
export class ExamenService extends GenericService<Examen> {
    referenceURL: string;
    referenceMicasURL: string;
    
    constructor(private fbdb: AngularFireDatabase, _db: BaseAjaxService) {
        super(_db);
        this.referenceMicasURL = '/micas';
        this.referenceURL = '/examenes';
    }

    newInstance(){ return new Examen(); }

    getLastExamen(pacienteID: number){
        let params = this.db.createParameter('OPTICA_0001', 2, { V3: pacienteID });
        return this.db.getData(params).map((result)=> {
            let examen = this.mapData(result.Table.length > 0 ? result.Table[0] : null);
            if(result.Table1.length > 0){
                let oD = result.Table1.find((item)=> item.C5 === true);
                let oI = result.Table1.find((item)=> item.C5 === false);
                if(oD) examen.ojoDerecho = this.mapGenericData(new Ojo(), oD);
                if(oI) examen.ojoIzquierdo = this.mapGenericData(new Ojo(), oI);
            }
            return examen;
        });
    }

    saveExamen(pacienteID: number, examen: Examen){
        let params = this.db.createParameter('OPTICA_0001', 1, {
            V3: pacienteID,
            V4: examen.tipoMicaRecomendadoID,
            V5: examen.materialRecomendadoID,
            V6: examen.esReceta ? 1 : 0,
            V7: isNaN(examen.adicion) ? '' : examen.adicion,
            V8: isNaN(examen.altura) ? '' : examen.altura,
            V9: examen.observaciones ? examen.observaciones : '',
            V10: examen.oftalmologo ? examen.oftalmologo : '',
            V11: examen.ojoDerecho.esfera,
            V12: examen.ojoDerecho.cilindro,
            V13: examen.ojoDerecho.grados,
            V14: examen.ojoDerecho.distanciaInterPupilar ? examen.ojoDerecho.distanciaInterPupilar : '',
            V21: examen.ojoIzquierdo.esfera,
            V22: examen.ojoIzquierdo.cilindro,
            V23: examen.ojoIzquierdo.grados,
            V24: examen.ojoIzquierdo.distanciaInterPupilar ? examen.ojoIzquierdo.distanciaInterPupilar : ''
        })
        return this.db.getData(params).map(result => {
            if(result.Table.length > 0) examen.key = result.Table[0].C0;
            return examen;
        });
    }
}