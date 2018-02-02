import { Injectable } from '@angular/core';
//import * as moment from 'moment';
import { Venta, MetodoPago } from '../models/venta.models';
import { GenericServiceBase } from 'app/modules/generic-catalogs/services/generic.service';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { ResumenVenta, Ingresos } from 'app/modules/venta/models/ventas-reporting.models';

@Injectable()
export class VentasReportingService{
    constructor(private db: BaseAjaxService){
    }

    getResumenMensual(month: number, year: number, sucursalID: number){
        let params = this.db.createParameter('ECOM0003', 10, {
            V4: sucursalID,
            V5: year,
            V6: month
        })
        return this.db.getData(params).map(data=>{
            let resumen = new ResumenVenta();
            let _dResume = data.Table[0];
            resumen.totalVenta = _dResume.C1;
            resumen.totalPagado = _dResume.C2;
            resumen.noVentas = _dResume.C3;
            resumen.ingresos = data.Table1.map(ing=>{
                let mp = new MetodoPago(ing.C1);
                mp.key = ing.C1;
                return new Ingresos(mp, ing.C2);
            })
            return resumen;
        })
    }

    //Exclusivo Optika
    getResumenMensualOptika(month: number, year: number, sucursalID: number){
        let params = this.db.createParameter('OPTICA_0001', 10, {
            V4: sucursalID,
            V5: year,
            V6: month
        })
        return this.db.getData(params).map(data=>{
            return {
                oftalmologos: data.Table.map( row=> {
                    return {nombre: row.C1, noExamenes: row.C2};
                }),
                armazones: data.Table1.map( row=> {
                    return {armazon: row.C1, noVentas: row.C2};
                })
            }
        })
    }
}