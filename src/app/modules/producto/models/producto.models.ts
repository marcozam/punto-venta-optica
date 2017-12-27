import { BaseGenericCatalog, GenericCatalog } from '../../generic-catalogs/models/generic-catalogs.models';


export class CategoriaProducto {
  productos: Producto[];
  sumary: CategoriaProductoSumary;

  constructor(_sumary?: CategoriaProductoSumary){
    this.sumary = _sumary ? _sumary : new CategoriaProductoSumary('');
    this.productos = new Array<Producto>();
  }
}

export class CategoriaProductoSumary extends GenericCatalog {
  usaInventario: boolean;
  catalogoID: number;
  formatoNombre: string;

  constructor(_nombre: string) {
    super();
    this.key = '0';
    this.nombre = _nombre;
    this.usaInventario = true;
  }
}

export class Producto extends GenericCatalog {
  //presentacion: string;
  imagen?: string;
  descripcion?: string;
  precio?: number = 0;
  SKU: string;
  detalleID: number;
  requireProcesamiento: boolean = false;
  categoriaProductoID: number;
  categoriaProducto: CategoriaProductoSumary;

  constructor(_nombre: string, _categoria?: CategoriaProductoSumary) {
    super();
    this.key = '0';
    this.nombre = _nombre;
    this.categoriaProducto = _categoria;
  }
}

export class PrecioProducto {
  productoID: number;
  listaPreciosID: number;
  precio: number;
  constructor(productID: number){
    this.productoID = productID;
    this.precio = 0;
  }
}

export class ListaPrecios extends GenericCatalog {
  fechaInicio: number;
  fechaFin: number;
  
  //Reference Properties
  precios?: PrecioProducto[];
}