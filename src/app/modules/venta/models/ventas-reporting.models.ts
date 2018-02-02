import { MetodoPago } from "app/modules/venta/models/venta.models";

export class Ingresos{
    constructor(
        public metodPago: MetodoPago, 
        public monto: number
    ){}
}

export class ResumenVenta{
    totalVenta: number;
    noVentas: number;
    totalPagado: number;

    ingresos: Ingresos[];
    constructor(){}
}