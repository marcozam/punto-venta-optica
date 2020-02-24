import { Producto } from 'app/modules/producto/models/producto.models';

export interface Inventario {
  key: number;
  cantidad: number;
  productoUuid: number;
  ubicacionUuid: number;
  cantidadFisica?: number;
  producto?: Producto;
}
