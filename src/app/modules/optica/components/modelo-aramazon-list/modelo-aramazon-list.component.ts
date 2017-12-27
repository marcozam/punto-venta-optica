import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TableSource, TableColumn } from 'app/modules/base/models/base.models';
import { ModeloArmazon, MarcaArmazon } from 'app/modules/optica/models/armazon.models';

import { ModeloArmazonService } from 'app/modules/optica/services/modelo-armzaon.service';
import { CategoriaArmazonService } from 'app/modules/optica/services/categoria-armazon.service';
import { MarcaArmazonService } from 'app/modules/optica/services/marca-armazon.service';
import { GenericCatalog } from 'app/modules/generic-catalogs/models/generic-catalogs.models';

@Component({
  selector: 'app-modelo-aramazon-list',
  templateUrl: './modelo-aramazon-list.component.html',
  styleUrls: ['./modelo-aramazon-list.component.scss'],
  providers: [ ModeloArmazonService, CategoriaArmazonService, MarcaArmazonService ]
})
export class ModeloAramazonListComponent implements OnInit {

  categoriaArmazon: GenericCatalog[];
  marcas: MarcaArmazon[];

  dataSource: TableSource<ModeloArmazon>;

  constructor(
    private service: ModeloArmazonService, 
    private _categorias: CategoriaArmazonService, 
    private _marca: MarcaArmazonService,
    private router: Router) { 
    this.dataSource = new TableSource();
    this.dataSource.columns = [
      new TableColumn(
        'Categoria',
        'categoria',
        (item: ModeloArmazon) => { return item.categoria ? item.categoria.nombre : item.marca.categoria.nombre }
      ),
      new TableColumn(
        'Marca',
        'marca',
        (item: ModeloArmazon) => { return item.marca.nombre }
      ),
      new TableColumn(
        'Modelo',
        'modelo',
        (item: ModeloArmazon)=>{ return item.nombre }
      )
    ]
    //Default Sorts
    this.dataSource.columns[0].sortOrder = 0;
    this.dataSource.columns[0].sortDirection = 'desc';
    this.dataSource.columns[1].sortOrder = 1;
    this.dataSource.columns[1].sortDirection = 'desc';
  }

  ngOnInit() {
    this.service.getCatalogList(((res: ModeloArmazon[])=> this.dataSource.updateDataSource(res)));
    this._marca.getCatalogList((res)=> this.marcas = res);
  }

  add(){
    this.router.navigate(['/armazon/modelo/new']);
  }

  edit(item: ModeloArmazon){
    this.router.navigate([`/armazon/modelo/${item.key}`]);
  }

  delete(item: ModeloArmazon){
    //this.service.deleteModelo(item, ()=>{ })
  }
}