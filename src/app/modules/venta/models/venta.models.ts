import { Subject } from 'rxjs/Subject';
import { Producto } from '../../producto/models/producto.models';
import { Contacto } from 'app/modules/crm/models/crm.models';
import { 
    BaseGenericCatalog, 
    GenericCatalog, 
    Persona, 
    Sucursal, 
    Status 
} from '../../generic-catalogs/models/generic-catalogs.models';


export class Venta {  
    private _detalle: DetalleVenta[] = [];
    
    get detalle(): DetalleVenta[]{ return this._detalle; }

    pagos: DetallePagos[];
    comentarios: ComentariosVenta[]
    sumary: SumaryVenta;

    //used to validate products stock
    onDetalleChanged: Subject<DetalleVenta[]> = new Subject();

    constructor(){
        this.pagos = new Array<DetallePagos>();
        this.comentarios = new Array<ComentariosVenta>();
        this.sumary = new SumaryVenta();
    }

    updateDetalleVenta(items: DetalleVenta[], removed?: DetalleVenta[]){
        let changes: DetalleVenta[] = [];
        //search for changes on list
        items.forEach(ndv => {
            let idx = this._detalle.findIndex(dv => ndv.productoVenta.key === dv.productoVenta.key);
            if(idx >= 0) {
                if(this._detalle[idx].hasChanges(ndv)) {
                    this._detalle[idx] = ndv;
                    changes.push(ndv);
                }
            }
            else {
                this._detalle.push(ndv);
                changes.push(ndv);
            }
        });
        if(removed){
            this._detalle = this._detalle.filter(dv=>{
                let item = removed.find(ndv => ndv.productoVenta.key === dv.productoVenta.key);
                return item ? false : true;
            });
        }
        this.updateSubTotal();
        if(changes.length > 0) this.onDetalleChanged.next(changes);
    }

    private updateSubTotal(){
        if(this.detalle.length > 0){
            let data = this.detalle
                .map(d=> { return { Importe: d.importeNeto, Descuento: d.descuento }})
                .reduce((p, c) => { 
                    c.Importe += p.Importe;
                    c.Descuento += p.Descuento;
                    return c;
                });
            this.sumary.subTotal = data.Importe;
            this.sumary.descuento = data.Descuento;
        }
        else {
            this.sumary.subTotal = 0;
            this.sumary.descuento = 0;
        }
        this.sumary.impuestos = (this.sumary.subTotal - this.sumary.descuento) * .16;
    }
}

export class Usuario extends GenericCatalog {

}

export class SumaryVenta extends BaseGenericCatalog {
    
    cliente: Contacto;
    vendedor: Usuario;
    sucursal?: Sucursal;
    status?: Status;
    subTotal: number;
    descuento: number = 0;
    totalPagado: number;
    totalRecibido?: number;
    impuestos: number;
    fecha: Date;

    get total(): number {
        return this.subTotal - this.descuento + this.impuestos;
    }

    get saldo(): number {
        return this.total - this.totalPagado;
    }

    constructor(){
        super();
        this.key = 0;
        this.cliente = new Contacto();
        this.cliente.persona = new Persona();
        this.sucursal = new Sucursal();
        this.sucursal.nombre = 'MATRIZ';
        this.vendedor = new Usuario();
        this.vendedor.nombre = 'ROCIO GASTELUM';
        this.subTotal = 0;
        this.impuestos = 0;
        this.totalPagado = 0;
        this.fecha = new Date();
    }
}

export class DetallePagos {
    fecha: Date;
    esPagoInicial: boolean;
    corteID: number;
    monto: number;
    totalRecibido: number;
    metodoPago: MetodoPago;
    key: number;
    //ordenVentaID: number;
}

export class ComentariosVenta {
    key: number;
    productoID: number;
    //use to group products
    moduleID?: number = 1;

    constructor(public comentario: string) { }
}

export class DetalleVenta extends BaseGenericCatalog {
    cantidad: number;
    precioUnitario: number;
    
    promocionID: number;
    tipoDescuentoID: number = 1;
    valorDescuento: number = 0;
    descuento: number = 0;
    comentario: string;

    //use to group products
    moduleID: number = 1;
    canEditCantidad?: boolean;
    canEditPrecio?: boolean;

    get importe(): number {
        return this.cantidad * (this.precioUnitario - this.descuento);
    }

    get importeNeto(): number {
        return this.cantidad * this.precioUnitario;
    }
    
    productoVenta: Producto;

    constructor(_producto: Producto, precio?: number){
        super();
        this.productoVenta = _producto;
        this.cantidad = 1;
        this.precioUnitario = precio ? precio : 0;
        this.keysChanges = ['cantidad', 'precioUnitario', 'descuento']
    }
}

//MOVE SOMEWHERE ELSE
export class MetodoPago extends GenericCatalog {
    codigo: string;
    enVenta: boolean;
    enCorte: boolean;
    utilizaReferencia: boolean;

    constructor(nombre?: string){
        super();
        this.nombre = nombre ? nombre : '';
    }
}