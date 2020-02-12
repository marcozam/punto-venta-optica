import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Services
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { GenericService } from 'app/modules/generic-catalogs/services/generic.service';
// Models
import { Examen, Ojo, MicaPrecio, TratamientoMicaPrecios } from '../models/examen.models';

@Injectable()
export class ExamenService extends GenericService<Examen> {
    referenceURL: string;
    referenceMicasURL: string;

    constructor(_db: BaseAjaxService) { super(_db); }

    newInstance() { return new Examen(); }

    getLastExamen(pacienteID: number) {
        const params = this.db.createParameter('OPTICA_0001', 2, { V3: pacienteID });
        return this.db.getData(params).pipe(map((result) => {
            const examen = this.mapData(result.Table.length > 0 ? result.Table[0] : null);
            if (result.Table1.length > 0) {
                const oD = result.Table1.find((item) => item.C5 === true);
                const oI = result.Table1.find((item) => item.C5 === false);
                if (oD) {
                    examen.ojoDerecho = this.mapGenericData(new Ojo(), oD);
                }
                if (oI) {
                    examen.ojoIzquierdo = this.mapGenericData(new Ojo(), oI);
                }
            }
            return examen;
        }));
    }

    saveVentaExamen(ventaID: number, examenID: number, materialID: number, tipoMicaID: number) {
        const params = this.db.createParameter('OPTICA_0001', 4, {
            V3: examenID,
            V4: tipoMicaID,
            V5: materialID,
            V6: ventaID
        });
        return this.db.getData(params);
    }

    saveExamen(pacienteID: number, examen: Examen) {
        const params = this.db.createParameter('OPTICA_0001', 1, {
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
        });
        return this.db.getData(params).pipe(map(result => {
            if (result.Table.length > 0) {
                examen.key = result.Table[0].C0;
            }
            return examen;
        }));
    }

    getPrecioMica(examen: Examen, precio: MicaPrecio): number {
        let _precioBase = precio.precioBase + 270;
        // Revisa si la mica es Cilindrica
        if (examen.ojoDerecho.cilindro !== 0 || examen.ojoIzquierdo.cilindro !== 0) {
          // TODO: Obtener el precio de la mica cilindrica
          _precioBase += 150;
        }
        // Calcula Dioptrias adicionales
        // TODO: Obtener datos de la BD
        const _maximoDioptrias = 3;
        const _precioDioptria = 15;
        const _dioptrias: number = Math.max(
          Math.abs(examen.ojoDerecho.esfera),
          Math.abs(examen.ojoIzquierdo.esfera),
          Math.abs(examen.ojoDerecho.cilindro),
          Math.abs(examen.ojoIzquierdo.cilindro),
        );
        if (_dioptrias > _maximoDioptrias) {
          _precioBase += ((_dioptrias - _maximoDioptrias) / .25) * _precioDioptria;
        }
        return _precioBase;
    }

    getPrecio(listaPrecioID: number, materialID: number, tipoMicaID: number): Observable<MicaPrecio> {
        const params = this.db.createParameter('OPTICA_0001', 3, {
            V3: listaPrecioID,
            V4: tipoMicaID,
            V5: materialID
        });
        return this.db.getData(params).pipe(map(data => {
            if (data.Table.length > 0) {
                const precio = new MicaPrecio(data.Table[0].C1, materialID, tipoMicaID);
                precio.tratamientos = data.Table1.map(item => new TratamientoMicaPrecios(item.C1, item.C2, item.C3));
                return precio;
            }
            return null;
        }));
      }
}
