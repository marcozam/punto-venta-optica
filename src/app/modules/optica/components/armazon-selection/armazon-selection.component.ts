import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// Models
import { MarcaArmazon, ModeloArmazon, MedidasArmazon } from '../../models/armazon.models';
import { ComentariosVenta } from 'app/modules/venta/models/venta.models';
import { GenericCatalog } from 'app/modules/base/models/base.models';
import { Producto } from 'app/modules/producto/models/producto.models';
// Services
import { ModeloArmazonService } from '../../services/modelo-armzaon.service';
import { CategoriaArmazonService } from '../../services/categoria-armazon.service';
import { MarcaArmazonService } from '../../services/marca-armazon.service';

@Component({
  selector: 'app-armazon-selection',
  templateUrl: './armazon-selection.component.html',
  styleUrls: ['./armazon-selection.component.scss'],
  providers: [CategoriaArmazonService, MarcaArmazonService, ModeloArmazonService ]
})
export class ArmazonSelectionComponent implements OnInit {
  @Input() listaPrecioID: number;

  @Input() mostrarMedidas = true;

  @Output() onChange: EventEmitter<any> = new EventEmitter();


  esArmazonPropio: boolean;
  marcasArmazon: MarcaArmazon[];
  modelosArmazon: ModeloArmazon[];
  marca: MarcaArmazon;
  detalle: Producto;

  constructor(
    private _categorias: CategoriaArmazonService,
    private _marca: MarcaArmazonService,
    private _modeloService: ModeloArmazonService,
  ) { }

  ngOnInit() {
    // this._marca.getCatalogList(marcas => this.marcasArmazon = marcas);
  }

  onArmazonPropioChange(value: boolean) {
    this.esArmazonPropio = value;
    if (value && this.detalle) {
      this.onChange.emit({added: [], removed: this.detalle, isComment: false, moduleID: 999});
    }
  }

  onArmazonChange(value) {
    const comentario = new ComentariosVenta(`ARMAZON PROPIO: ${value}`);
    comentario.productoID = 0;
    comentario.moduleID = 999;
    this.onChange.emit({added: [comentario], isComment: true, moduleID: 999});
  }

  onMarcaChanged(value: MarcaArmazon) {
    this.marca = value;
    /*
    this._modeloService.getModelosByMarca(value.key.toString(), (modelos: ModeloArmazon[]) => {
      this.modelosArmazon = modelos;
    });
    */
  }

  medidasChange(value: MedidasArmazon) {
    if (value) {
      const keys = Object.keys(value);
      const comentarios = keys.map(k => {
        const comentario = new ComentariosVenta(`${this.getKeyReadable(k)}: ${value[k]}`);
        comentario.productoID = 0;
        comentario.moduleID = 995;
        return comentario;
      });
      this.onChange.emit({added: comentarios, removed: null, isComment: true, moduleID: 995});
    } else {
      this.onChange.emit({added: [], removed: null, isComment: true, moduleID: 995});
    }
  }

  getKeyReadable(key: string) {
    key = key.replace(/_/g, ' ');
    if (key === key.toUpperCase()) {
      return key;
    } else {
      let i = 0, lastIdx = 0;
      const newString = [];
      for (const c of key){
        if (c.match(/[A-Z]/) && lastIdx !== i - 1) {
          newString.push(key.substring(lastIdx, i));
          lastIdx = i;
        }
        i++;
      }
      newString.push(key.substring(lastIdx));
      return newString.join(' ').toUpperCase();
    }
  }

  onModeloChanged(value: ModeloArmazon) {
    let _categoria: GenericCatalog = this.marca.categoria;
    if (value.categoria) {
      if (value.categoria.key) {
        _categoria = value.categoria;
      }
    }

    /*
    this._categorias.getPrecioCategoria(this.listaPrecioID, _categoria.key, precio => {
      this._modeloService.getProduct(value.modeloID, product => {
        this.onChange.emit({added: { producto: product, precio: precio.precio }, removed: this.detalle, isComment: false});
        this.detalle = product;
      });
    });
    */
  }
}
