import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
// Models
import { MarcaArmazon, ModeloArmazon } from './../../models/armazon.models';
import { GenericCatalog } from 'app/modules/base/models/base.models';
// Services
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { ModeloArmazonService } from '../../services/modelo-armzaon.service';
import { MarcaArmazonService } from '../../services/marca-armazon.service';
import { CategoriaArmazonService } from '../../services/categoria-armazon.service';

@Component({
  selector: 'app-modelo-armazon',
  templateUrl: './modelo-armazon.component.html',
  styleUrls: ['./modelo-armazon.component.scss'],
  providers: [CategoriaArmazonService, MarcaArmazonService, ModeloArmazonService, DialogBoxService, ]
})
export class ModeloArmazonComponent implements OnInit {

  categoriaArmazon: GenericCatalog[];
  marcaArmazon: MarcaArmazon[];
  catalogID = 997;
  item: ModeloArmazon;
  isLoading = true;

  constructor(
    private _categorias: CategoriaArmazonService,
    private _marca: MarcaArmazonService,
    private _modeloService: ModeloArmazonService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: DialogBoxService) {
    // _categorias.setListRefURL('armazones/categorias');
    this.item = new ModeloArmazon();
  }

  ngOnInit() {
    const _detailID = this.route.snapshot.params['detailID'];
    /*
    // Obtiene todas las Categorias del Armazon
    this._categorias.getCatalogList((dCat) => {
      this.categoriaArmazon = dCat;
      // Obtiene todas las Marcas del Armazon
      this._marca.getCatalogList((dMarca) => {
        this.marcaArmazon = dMarca;
        this.isLoading = false;
        if (_detailID !== 'new') {
          this.isLoading = true;
          // Obtiene el modelo
          this._modeloService.getCatalogItem(_detailID, _item => {
            this.item = _item;
            if (this.item.categoria) {
              this.item.categoria = this.categoriaArmazon.filter(ca => ca.key === this.item.categoria.key)[0];
            }
            this.item.marca = this.marcaArmazon.filter(ca => ca.key === this.item.marca.key)[0];
            this.isLoading = false;
          });
        }
      });
    });
    */
  }

  onSave(newValue: any) {
    /*
    this._modeloService.save(this.item, newValue, () => {
      this.dialog.openDialog('Registro exitoso!', 'La informacion se ha guardado con exito.', false);
      const _url = '/optica/armazon/modelo';
      this.router.navigate([_url]);
    });
    */
  }
}
