import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { MetaDataCatalog } from '../../../generic-catalogs/models/metadata-catalogs.models';
import { CategoriaProducto, CategoriaProductoSumary } from '../../models/producto.models';

import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { CatalogsMetadataService } from '../../../generic-catalogs/services/catalogs-metadata.service';
import { CategoriaProductoService } from '../../services/categoria-producto.service';

@Component({
  selector: 'app-categoria-producto',
  templateUrl: './categoria-producto.component.html',
  styleUrls: ['./categoria-producto.component.scss'],
  providers: [CatalogsMetadataService, CategoriaProductoService, DialogBoxService]
})
export class CategoriaProductoComponent implements OnInit {
  item: CategoriaProductoSumary;
  catalogos: MetaDataCatalog[];
  productoID: number;

  constructor(
    private _catalogService: CatalogsMetadataService, 
    private _categoriaService: CategoriaProductoService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: DialogBoxService) 
    { 
      this.item = new CategoriaProductoSumary('');
    }

  ngOnInit() {
    this.productoID = this.route.snapshot.params['detailID'];
    this._catalogService.getCatalogList((r => this.catalogos = r));
    if(this.productoID > 0){
      this._categoriaService.getByID(this.productoID)
        .subscribe(r => this.item = r );
    }
  }

  onSave(value){
    this.item = Object.assign(this.item, value)
    this._categoriaService.save(this.item, r=>{
      this.dialog.openDialog('Registro exitoso!', 'La informacion se ha guardado con exito.', false);
    });
  }
}
