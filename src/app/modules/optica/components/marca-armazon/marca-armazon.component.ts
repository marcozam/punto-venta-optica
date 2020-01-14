import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GenericCatalog } from 'app/modules/base/models/base.models';
import { MarcaArmazon } from '../../models/armazon.models';

import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { MarcaArmazonService } from './../../services/marca-armazon.service';

@Component({
  selector: 'app-marca-armazon',
  templateUrl: './marca-armazon.component.html',
  styleUrls: ['./marca-armazon.component.scss'],
  providers: [MarcaArmazonService, DialogBoxService]
})
export class MarcaArmazonComponent implements OnInit {

  categoriaArmazon: GenericCatalog[];
  catalogID: string = '998';
  item: MarcaArmazon;
  isLoading: boolean = true;

  constructor(
    // private _categoriaService: FBGenericService<GenericCatalog>,
    private _marcaService: MarcaArmazonService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: DialogBoxService) {
    // _categoriaService.setListRefURL('armazones/categorias');
    this.item = new MarcaArmazon();
  }

  ngOnInit() {
    let _detailID = this.route.snapshot.params['detailID'];
    /*
    this._categoriaService.getCatalogList((data) => {
      this.categoriaArmazon = data;
      this.isLoading = false;
      if(_detailID !== 'new'){
        this.isLoading = true;
        this._marcaService.getCatalogItem(_detailID, _item=> {
          this.item = _item;
          this.item.categoria = this.categoriaArmazon.filter(ca=> ca.key === this.item.categoria.key)[0];
          this.isLoading = false;
        });
      }
    })
    */
  }

  onSave(newValue: MarcaArmazon){
    this._marcaService.save(this.item, newValue);
    this.dialog.openDialog('Registro exitoso!', 'La informacion se ha guardado con exito.', false);
    let _url = '/DCG/catalogo/' + this.catalogID;
    this.router.navigate([_url]);
  }
}
