import { ComentariosVenta, DetalleVenta } from "app/modules/venta/models/venta.models";

export class OpticaVentaChangeEvent {
    comentarios: ComentariosVenta[];
    detalle: DetalleVenta[];
    isRemove?: boolean;
}