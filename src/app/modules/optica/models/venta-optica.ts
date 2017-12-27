import { Examen } from "app/modules/optica/models/examen.models";
import { OpticaVentaChangeEvent } from 'app/modules/optica/models/optica-venta.models';
import { Venta } from "app/modules/venta/models/venta.models";

export abstract class VentaOptica {
    venta: Venta;
    clienteID: number;
    listaPrecioID: number;
    sucursalID: number;
    examen: Examen;

    constructor(){
        this.venta = new Venta();
        this.venta.sumary.key = 0;
    }

    onOpticaVentaChanged(data: OpticaVentaChangeEvent){
        data.isRemove ?
            this.venta.updateDetalleVenta([], data.detalle) :
            this.venta.updateDetalleVenta(data.detalle);
        this.venta.comentarios = this.venta.comentarios.filter(c=> c.moduleID !== 999 && c.moduleID !== 998 && c.moduleID !== 995).concat(data.comentarios);
    }

    onExamenChanged(value: Examen){
        if(value) this.examen = value;
    }
}