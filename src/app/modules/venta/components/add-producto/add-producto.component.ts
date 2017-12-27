import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { ProductosService } from '../../../producto/services/productos.service';
import { CategoriaProductoService } from '../../../producto/services/categoria-producto.service';
import { ListaPreciosService } from '../../../producto/services/lista-precios.service'

import { DetalleVenta } from '../../models/venta.models';
import { CategoriaProductoSumary, Producto, CategoriaProducto, PrecioProducto } from '../../../producto/models/producto.models';
import { Form, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-producto',
  templateUrl: './add-producto.component.html',
  styleUrls: ['./add-producto.component.scss'],
  providers: [ProductosService, CategoriaProductoService, ListaPreciosService]
})
export class AddProductoComponent implements OnInit {

  @Input()
  listaPreciosID: number;
  categorias: CategoriaProducto[];
  preciosDetalle: PrecioProducto[];
  productos: Producto[];
  selectedProduct: Producto;

  @Output()
  onProdutoAdded: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('formAddProduct') form: FormControl;
  @ViewChild('cantidadField') field: ElementRef;

  constructor(
    private _productoService: ProductosService, 
    private _categoriaService: CategoriaProductoService, 
    private _listaPreciosService: ListaPreciosService) 
    { }

  createSubscriptions(){
    /*
    this.loading$.subscribe((isLoading: boolean) => {
      this.loading = this._categoriaService.isLoading || this._service.isLoading;
    });
    */

    this._categoriaService.source$
      .subscribe((r: CategoriaProductoSumary[]) => {
        this.categorias = r.map(cat => new CategoriaProducto(cat));
        this.categorias.forEach(cat=>{
          this._productoService.getProductsByCategory(Number(cat.sumary.key))
        });
      });

    this._productoService.source$.subscribe((products: Producto[]) => {
      if(products.length > 0){
        let fProd = products[0];
        let wCat = this.categorias.find(c=> c.sumary.key === fProd.categoriaProductoID);
        wCat.productos = products.map(prod=>{
          let precio = this.preciosDetalle.find(p=> p.productoID === prod.key);
          prod.precio = precio ? precio.precio : 0;
          return prod;
        })
      }
    });
  }

  ngOnInit() {
    this.createSubscriptions();
    //First get prices
    this._listaPreciosService.getPreciosPreductos(this.listaPreciosID, (precios: PrecioProducto[]) =>{
      this.preciosDetalle = precios;
      this.field.nativeElement.focus();
      this._categoriaService.getStandAloneCategories()
    });
  }

  cleanData(){
    this.form.reset({
      cantidad: '',
      precio: 0,
      categoriaID: 0,
      productoID: 0
    })
    this.field.nativeElement.focus();
  }

  searchProductBySKU(sku: string){
    let rval = null;
    this.categorias.forEach(cat=>{
      let prods = cat.productos.filter(prod=>{
        return prod.SKU === sku;
      });
      if(prods.length > 0){
        rval = prods[0];
      }
    })
    return rval;
  }

  addDetalleVenta(producto: Producto, cantidad: number){
    let dv = new DetalleVenta(producto);
    dv.cantidad = cantidad;
    dv.precioUnitario = producto.precio;
    dv.canEditPrecio = false;
    dv.canEditCantidad = true;
    this.onProdutoAdded.emit(dv);
    this.cleanData();
  }

  onCantidadKeyDown(event){
    let currentValue: string = event.target.value;
    let cantidad: number = 1;
    let codigo: string;
    let producto: Producto;
    if(event.keyCode === 42 && currentValue.includes('*')) {
        return false;
    }
    if(event.keyCode === 13){
      if(currentValue.includes('*')){
        let parts = currentValue.split('*');
        cantidad = new Number(parts[0]).valueOf();
        cantidad = Number.isNaN(cantidad) ? 1 : cantidad;
        codigo = parts[1];
      }
      else{
        //Revisa si el valor es un codigo de barras
        if(currentValue.length >= 8){
          codigo = currentValue;
        }
      }
      if(codigo){
        producto = this.searchProductBySKU(codigo);
        if(producto){
          this.addDetalleVenta(producto, cantidad);
        }
      }
    }
  }

  onCategoriaChanged(productos: Producto[]){
    this.productos = productos;
  }

  onProductoChange(producto: Producto){
    this.selectedProduct = producto;
  }

  addProduct(value){
    let cantidad = Number.isNaN(value) ? 1 : Number(value);
    if(cantidad <= 0){
      cantidad = 1;
    }
    if(this.selectedProduct){
      this.addDetalleVenta(this.selectedProduct, cantidad);
    }
  }
}