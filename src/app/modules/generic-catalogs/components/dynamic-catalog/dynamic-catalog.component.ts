import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
// Services
import { CatalogsMetadataService } from '../../services/catalogs-metadata.service';
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
// Models
import { MetaDataTable, MetaDataField, MetaDataCatalog } from '../../models/metadata-catalogs.models';
import { GenericCatalog } from 'app/modules/base/models/base.models';
// Constants
import { SuccessTitle, SuccessMessage } from 'app/modules/base/constants/messages.contants';

@Component({
  selector: 'app-dynamic-catalog',
  templateUrl: './dynamic-catalog.component.html',
  styleUrls: ['./dynamic-catalog.component.scss'],
  providers: [CatalogsMetadataService]
})
export class DynamicCatalogComponent implements OnInit {

  catalogID: number;
  catalog: MetaDataCatalog;
  private allTables: MetaDataTable[];
  tables: MetaDataTable[];
  fieldTypes: GenericCatalog[];

  @ViewChild('dcForm') form: NgForm;

  constructor(
    private _service: CatalogsMetadataService,
    private _dialog: DialogBoxService,
    private route: ActivatedRoute,
    private router: Router) {
    this.catalog = new MetaDataCatalog();
  }

  getInitialData() {
    this._service.getDBTables().subscribe(result => this.allTables = this.tables = result);
    this._service.getFieldTypes().subscribe(result => this.fieldTypes = result);
  }

  ngOnInit() {
    this.catalogID = this.route.snapshot.params['catalogID'];

    this.getInitialData();

    if (this.catalogID > 0) {
      this._service.getByID(this.catalogID).subscribe((categoria: MetaDataCatalog) => {
        this._service.getFieldsList(this.catalogID)
          .subscribe(result => {
            categoria.fields = result;
            this.catalog = categoria;
          });
      });
    }
  }

  onTableSelected(item: MatAutocompleteSelectedEvent) {
    this._service.getDBColumns(item.option.value)
      .subscribe(r => console.log(r));
  }

  onTableModelChange(text) {
    if (text) {
      text = text.toUpperCase();
      this.tables = this.allTables.filter(r => {
        return r.name.toUpperCase().indexOf(text) >= 0;
      });
    } else {
      this.tables = this.allTables;
    }
  }

  onSave(data: MetaDataCatalog) {
    this._service.save(this.catalog, data)
      .subscribe(() => {
        this._dialog.openDialog(SuccessTitle, SuccessMessage);
        this.router.navigate(['/DCG']);
      });
  }

  saveRequested(fields: MetaDataField[]) {
    this.catalog.fields = fields;
    if (this.form.valid) { this.onSave(this.form.value); }
  }
}
