import { BaseGenericCatalog } from "app/modules/generic-catalogs/models/generic-catalogs.models";
import { MetodoPago } from "app/modules/venta/models/venta.models";

export class CorteCaja extends BaseGenericCatalog {
    movimientos: MovimientoCaja[];
    detalle: DetalleCorteCaja[];
    
    totalEsperado: number;
    totalRecibido: number;
    get diferencia(): number{
        return this.totalEsperado - this.totalRecibido;
    }

    constructor(public sucursalID: number, public usuarioID: number){
        super();
        this.detalle = [];
        this.movimientos = [];
    }
}

export class DetalleCorteCaja{
    montoRecibido: number;
    metodoPago: MetodoPago;
    get diferencia(): number{
        return this.montoEsperado - this.montoRecibido;
    }

    constructor(public metodoPagoID: number, public montoEsperado: number){
        this.montoRecibido = 0;
    }
}

export class MovimientoCaja extends BaseGenericCatalog {
    ordenVentaID: number;
    nombreCliente: string;
    fecha: Date;
    monto: number;
    totalVenta: number;
    esPagoInicial: boolean;
    nombreUsuario: string;
    corteID: number;
}