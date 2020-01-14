import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Models
import { GenericCatalog } from 'app/modules/base/models/base.models';
import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';
import { ModeloArmazon, MarcaArmazon } from 'app/modules/optica/models/armazon.models';
// Services
import { ModeloArmazonService } from 'app/modules/optica/services/modelo-armzaon.service';
import { MarcaArmazonService } from 'app/modules/optica/services/marca-armazon.service';

@Component({
  selector: 'app-modelo-aramazon-list',
  templateUrl: './modelo-aramazon-list.component.html',
  styleUrls: ['./modelo-aramazon-list.component.scss'],
  providers: [ ModeloArmazonService, MarcaArmazonService ]
})
export class ModeloAramazonListComponent implements OnInit {

  categoriaArmazon: GenericCatalog[];
  marcas: MarcaArmazon[];
  selectedMarca: MarcaArmazon;

  dataSource: TableSource<ModeloArmazon>;

  constructor(
    private service: ModeloArmazonService,
    private _marca: MarcaArmazonService,
    private router: Router) {
    this.dataSource = new TableSource();
    // Define filter function
    this.dataSource.filter = () => {
      return this.selectedMarca ?
        this.selectedMarca.nombre === 'All' ?
        this.dataSource.data :
        this.dataSource.data.filter(item => item.marcaID === this.selectedMarca.key) :
        this.dataSource.data;
    };
    this.dataSource.columns = [
      new TableColumn('Categoria', 'categoria', (item) => item.categoria ? item.categoria.nombre : item.marca.categoria.nombre ),
      new TableColumn('Marca', 'marca', (item) => item.marca.nombre ),
      new TableColumn('Modelo', 'modelo', (item) => item.nombre )
    ];
    // Default Sorts
    this.dataSource.columns[0].sortOrder = 0;
    this.dataSource.columns[0].sortDirection = 'desc';
    this.dataSource.columns[1].sortOrder = 1;
    this.dataSource.columns[1].sortDirection = 'desc';
  }

  ngOnInit() {
    /*
    this.service.getCatalogList(((res: ModeloArmazon[]) => this.dataSource.updateDataSource(res)));
    this._marca.getCatalogList((res) => this.marcas = res);
    */
  }

  onMarcaChange(marca: MarcaArmazon) {
    this.selectedMarca = marca;
    this.dataSource.applyFilters();
  }

  add() { this.navigate('new'); }

  edit(item: ModeloArmazon) { this.navigate(item.key.toString()); }

  navigate(key: string) { this.router.navigate([`/optica/armazon/modelo/${key}`]); }

  delete(item: ModeloArmazon) {
    console.log(item);
    // this.service.deleteModelo(item, () =>{ })
  }
}
