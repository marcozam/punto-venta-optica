import { Component, OnInit } from '@angular/core';

import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';

import { MetaDataCatalog } from '../../models/metadata-catalogs.models'

import { CatalogsMetadataService } from '../../services/catalogs-metadata.service';
import { TableSource, TableColumn } from 'app/modules/base/models/base.models';

@Component({
  selector: 'app-dynamic-catalog-list',
  templateUrl: './dynamic-catalog-list.component.html',
  styleUrls: ['./dynamic-catalog-list.component.scss'],
  providers: [CatalogsMetadataService]
})
export class DynamicCatalogListComponent implements OnInit {

  catalogs: MetaDataCatalog[];
  dataSource: TableSource<MetaDataCatalog>;

  constructor(private _db: CatalogsMetadataService) { 
    this.dataSource = new TableSource();
    this.dataSource.columns = [
      new TableColumn(
        'Nombre',
        'nombre',
        (item: MetaDataCatalog) => { return item.nombre }
      ),
      new TableColumn(
        'Tabla',
        'tabla',
        (item: MetaDataCatalog) => { return item.tableName }
      )
    ]
  }

  ngOnInit() {
    this._db.getCatalogList(r=>{
      this.catalogs = r;
      this.dataSource.updateDataSource(r);
    });
  }

  onDeleteItem(item: any){

  }
}