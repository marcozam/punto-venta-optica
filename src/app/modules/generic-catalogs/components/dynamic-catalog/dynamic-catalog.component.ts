import { Component, OnInit, ViewChild } from '@angular/core';
import { MetaDataTable, MetaDataField, MetaDataCatalog } from '../../models/metadata-catalogs.models'
import { CatalogsMetadataService } from '../../services/catalogs-metadata.service'
import { GenericCatalog } from '../../models/generic-catalogs.models';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

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

  constructor(private _db: CatalogsMetadataService, private route: ActivatedRoute) { 
    this.catalog = new MetaDataCatalog();
  }

  ngOnInit() {
    this.catalogID = this.route.snapshot.params['catalogID'];;
    this._db.getDBTables(r => this.allTables = this.tables = r);
    this._db.getFieldTypes(r => this.fieldTypes = r);
    if(this.catalogID > 0){
      this._db.getCatalogByID(this.catalogID, (cat: MetaDataCatalog) => {
        this._db.getFieldsList(this.catalogID, r => {
          cat.fields = r;
          this.catalog = cat;
        });
      });
    }
  }

  onTableSelected(item: MatAutocompleteSelectedEvent){
    this._db.getDBColumns(item.option.value, r=> {
      console.log(r);
    });
  }

  onTableModelChange(text){
    if(text){
      text = text.toUpperCase();
      this.tables = this.allTables.filter(r => {
        return r.name.toUpperCase().indexOf(text) >= 0;
      });
    }
    else{
      this.tables = this.allTables;
    }
  }

  onSave(data: MetaDataCatalog){
    this._db.save(this.catalog, data, r=> console.log(r));
  }

  saveRequested(fields: MetaDataField[]){
    this.catalog.fields = fields;
    if(this.form.valid){
      this.onSave(this.form.value);
    }
  }
}
