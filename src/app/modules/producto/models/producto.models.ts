import { BaseGenericCatalog, GenericCatalog } from 'app/modules/base/models/base.models';
import { Field } from 'app/modules/generic-catalogs/decorator/dynamic-catalog.decorator';


export class CategoriaProducto {
  productos: Producto[];
  sumary: CategoriaProductoSumary;

  constructor(_sumary?: CategoriaProductoSumary) {
    this.sumary = _sumary ? _sumary : new CategoriaProductoSumary('');
    this.productos = new Array<Producto>();
  }
}

export class CategoriaProductoSumary extends BaseGenericCatalog {
  @Field('C1', 40301) nombre: string;
  @Field('C2', 40302) catalogoID: number;
  @Field('C3', 40303) formatoNombre: string;
  @Field('C4', 40304) usaInventario: boolean;

  constructor(_nombre: string) {
    super();
    this.key = 0;
    this.nombre = _nombre;
    this.usaInventario = true;
    this.keysChanges = ['nombre', 'usaInventario', 'formatoNombre'];
  }
}

export class Producto extends BaseGenericCatalog {
  @Field('C1') nombre: string;
  @Field('C2') categoriaProductoID: number;
  @Field('C4') requireProcesamiento = false;
  @Field('C5') SKU: string;
  @Field('C6') detalleID: number;

  imagen?: string;
  descripcion?: string;
  precio = 0;

  private _categoriaProducto: CategoriaProductoSumary;
  get categoriaProducto(): CategoriaProductoSumary{ return this._categoriaProducto; }
  set categoriaProducto(value: CategoriaProductoSumary){
    this._categoriaProducto = value;
    this.categoriaProductoID = value ? Number(value.key) : 0;
  }

  constructor(_nombre: string, _categoria?: CategoriaProductoSumary) {
    super();
    this.keysChanges = ['nombre', 'categoriaProductoID', 'requireProcesamiento', 'SKU'];
    this.key = 0;
    this.nombre = _nombre;
    this.categoriaProducto = _categoria;
  }
}

export class PrecioProducto {
  productoID: number;
  listaPreciosID: number;
  precio: number;
  constructor(productID: number) {
    this.productoID = productID;
    this.precio = 0;
  }
}

export class ListaPrecios extends GenericCatalog {
  fechaInicio: number;
  fechaFin: number;

  // Reference Properties
  precios?: PrecioProducto[];
}
