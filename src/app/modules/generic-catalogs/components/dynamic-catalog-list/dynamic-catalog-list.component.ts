import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MetaDataCatalog } from '../../models/metadata-catalogs.models';

import { CatalogsMetadataService } from '../../services/catalogs-metadata.service';
import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';

@Component({
  selector: 'app-dynamic-catalog-list',
  templateUrl: './dynamic-catalog-list.component.html',
  styleUrls: ['./dynamic-catalog-list.component.scss'],
  providers: [CatalogsMetadataService]
})
export class DynamicCatalogListComponent implements OnInit {

  catalogs: MetaDataCatalog[];
  dataSource: TableSource<MetaDataCatalog>;

  constructor(
    private _service: CatalogsMetadataService,
    private router: Router) {
    this.dataSource = new TableSource();
    this.dataSource.columns = [
      new TableColumn(
        'Nombre',
        'nombre',
        (item: MetaDataCatalog) => item.nombre
      ),
      new TableColumn(
        'Tabla',
        'tabla',
        (item: MetaDataCatalog) => item.tableName ? item.tableName : ''
      )
    ];
    this.dataSource.columns[0].sortDirection = 'desc';
    this.dataSource.columns[0].sortOrder = 0;
  }

  ngOnInit() {
    this._service.source$.subscribe(result => this.dataSource.updateDataSource(result));
    this._service.getList();
  }

  onEdit(item: MetaDataCatalog) { this.router.navigate([`/DCG/${item.key}`]); }

  onAdd() { this.router.navigate(['/DCG/0']); }
}
