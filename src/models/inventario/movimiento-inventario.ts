import { Producto } from 'app/modules/producto/models/producto.models';
import { Inventario } from './inventario';
import { TipoMovimientoInventario } from './tipo-movimiento-inventario';

export interface MovimientoInventario {
  tipoMovimiento: TipoMovimientoInventario;
  // inventario?: Inventario;
  producto: Producto;
  cantidad: number;
  fecha: Date;
}

