import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { SuccessTitle, SuccessMessage } from 'app/modules/base/constants/messages.contants';

import { MetaDataCatalog } from 'app/modules/generic-catalogs/models/metadata-catalogs.models';
import { CategoriaProductoSumary } from '../../models/producto.models';

import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { CatalogsMetadataService } from 'app/modules/generic-catalogs/services/catalogs-metadata.service';
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
    public dialog: DialogBoxService) { this.item = new CategoriaProductoSumary(''); }

  ngOnInit() {
    this.productoID = this.route.snapshot.params['detailID'];
    this._catalogService.source$.subscribe(result => this.catalogos = result);
    this._catalogService.getList();

    if (this.productoID > 0) {
      this._categoriaService.getByID(this.productoID).subscribe(r => this.item = r );
    }
  }

  onSave(value) {
    this.item = Object.assign(this.item, value);
    this._categoriaService.save(this.item)
      .subscribe(() => { this.dialog.openDialog(SuccessTitle, SuccessMessage, false); });
  }
}
