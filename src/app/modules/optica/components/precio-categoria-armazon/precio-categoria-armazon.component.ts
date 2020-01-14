import { Component, OnInit, Input } from '@angular/core';
import { GenericCatalog } from 'app/modules/base/models/base.models';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { CategoriaArmazonService } from '../../services/categoria-armazon.service';

@Component({
  selector: 'app-precio-categoria-armazon',
  templateUrl: './precio-categoria-armazon.component.html',
  styleUrls: ['./precio-categoria-armazon.component.scss'],
  providers: [CategoriaArmazonService, DialogBoxService]
})
export class PrecioCategoriaArmazonComponent implements OnInit {

  @Input() listaPreciosID: number;
  categoriaArmazon: GenericCatalog[];
  categoria: any;

  constructor(private _categorias: CategoriaArmazonService, public dialog: DialogBoxService) { }

  ngOnInit() {
    /*
    this._categorias.getCatalogList((data: GenericCatalog[]) => {
      this._categorias.getPreciosCategorias(this.listaPreciosID, (result: any[]) => {
        this.categoriaArmazon = data.map(gc => {
          return Object.assign(gc, result.filter(p => p.key === gc.key)[0]);
        });
      }, true);
    });
    */
  }

  onSaveCategoriaArmazones(precios) {
    const _keys = Object.keys(precios);
    const listaPrecios = {};
    _keys.forEach((key) => {
      listaPrecios[key.replace('precio-', '')] = precios[key];
    });
    // this._categorias.setPrecioCategorias(listaPrecios, this.listaPreciosID);
    this.dialog.openDialog('Registro exitoso!', 'Los precios para las Categorias de Armazon. se guardaron correctamente', false);
  }
}
