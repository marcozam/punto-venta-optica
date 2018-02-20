// Move to some Base Module
import { MetodoPago, Venta } from 'app/modules/venta/models/venta.models';

export class Ingresos {
    constructor(public metodPago: MetodoPago, public monto: number) {}
}

export class ResumenVenta {
    totalVenta: number;
    noVentas: number;
    totalPagado: number;

    ingresos: Ingresos[];
    lista: Venta[];
    constructor() {}
}
