import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { CategoriaProductoService } from '../../services/categoria-producto.service';
import { ProductosService } from '../../services/productos.service';
import { CategoriaProductoSumary, Producto } from '../../models/producto.models';

@Component({
  selector: 'app-producto-detail',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
  providers: [ProductosService, CategoriaProductoService, DialogBoxService]
})
export class ProductosComponent implements OnInit {
  productoID: number;
  product: Producto;
  categorias: CategoriaProductoSumary[];
  
  constructor(
    private route: ActivatedRoute, 
    private _service: ProductosService, 
    private _categoriasService: CategoriaProductoService, 
    private router: Router, 
    public dialog: DialogBoxService) { 
    this.product = new Producto('');
  }

  createSubscriptions(){
    /*
    this.loading$.subscribe((isLoading: boolean) => {
      this.loading = this._categoriaService.isLoading || this._service.isLoading;
    });
    */

    this._categoriasService.source$.subscribe(result => this.categorias = result);
  }

  ngOnInit() {
    this.productoID = Number(this.route.snapshot.params['id']);
    this.createSubscriptions();
    this._categoriasService.getStandAloneCategories()

    if(this.productoID !== 0){
      this._service.getByID(this.productoID)
        .subscribe((item: Producto) => this.product = item);
    }
  }

  onCancelar(data: any){
    if(this._service.hasChanges(this.product, data))
    {
      this.dialog.openDialog('Advertencia!', 'Se perderan los datos capturados.\n ¿Desea continuar?', true, result => { 
        if(result){
          this.router.navigate(['/productos']);
        }
      });
    }
    else{
      this.router.navigate(['/productos']);
    }
  }

  onSave(data: Producto){
    this._service.save(this.product, data, r => {
      this.router.navigate(['/productos']);
      this.dialog.openDialog('Registro exitoso!', 'La informacion se ha guardado con exito.', false);
    })    
  }
}