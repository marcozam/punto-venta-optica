import { Producto } from "app/modules/producto/models/producto.models";
import { GenericCatalog, BaseGenericCatalog } from "app/modules/base/models/base.models";

export class TipoMovimientoInventario extends GenericCatalog {

}


export class MovimientoInventario {
    tipoMovimiento: TipoMovimientoInventario;
    producto: Producto;
    cantidad: number;
    fecha: Date;

    inventario: Inventario

    constructor(_producto: Producto){
        this.producto = _producto;
    }
}

export class Inventario extends BaseGenericCatalog {
    producto?: Producto;
    cantidad: number;
    cantidadFisica?: number;

    productoID: number;
    ubicacionlID: number;
}