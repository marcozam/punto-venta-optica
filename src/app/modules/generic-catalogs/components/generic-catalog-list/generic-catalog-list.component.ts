import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//Services
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { GenericCatalogService } from 'app/modules/generic-catalogs/services/generic.service';
import { _catalogs, CatalogsMetadataService } from 'app/modules/generic-catalogs/services/catalogs-metadata.service';
import { FBGenericService } from 'app/modules/generic-catalogs/services/fb-generic.service';
//Models
import { BaseGenericCatalog, GenericCatalog } from 'app/modules/base/models/base.models';
import { MetaDataCatalog, MetaDataField } from '../../models/metadata-catalogs.models';
import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-generic-catalog-list',
  templateUrl: './generic-catalog-list.component.html',
  styleUrls: ['./generic-catalog-list.component.scss'],
  providers: [GenericCatalogService, CatalogsMetadataService, DialogBoxService, FBGenericService]
})
export class GenericCatalogListComponent implements OnInit {
  catalogID: any;
  workingCatalog: MetaDataCatalog;
  detailURL: string = '';

  loading$: Observable<boolean>;
  loading: boolean = false;
  dataSource: TableSource<any>;

  constructor(
    private _genericService: GenericCatalogService, 
    private _metaDataService: CatalogsMetadataService,
    private fbGenericService: FBGenericService<GenericCatalog>,
    private route: ActivatedRoute, 
    private router: Router,
    public dialog: DialogBoxService) { 
    //Observer when app is retriving data
    this.loading$ = Observable.merge(this._metaDataService.loading$, this._genericService.loading$);
  }

  ngOnInit() {
    this.createSubscriptions();

    this.route.params.subscribe((params)=>{
      this.catalogID = Number(params['catalogID']);
      this.cleanData();

      this.workingCatalog = _catalogs.find(c=> c.key === this.catalogID);
      if(this.workingCatalog){
        this.dataSource.columns = [ new TableColumn('Nombre', 'nombre', item => item.nombre)];
        if(this.workingCatalog.detailURL) this.detailURL = this.workingCatalog.detailURL;
        this.fbGenericService.setListRefURL(this.workingCatalog.referenceURL);
        this.fbGenericService.getCatalogList(fbResult => { this.dataSource.updateDataSource(fbResult) }, true);
      }
      else this.loadCatalogData();
    });
  }

  cleanData(){
    this.detailURL = `/DCG/catalogo/${this.catalogID}/`;
    this.dataSource = new TableSource();
  }

  loadCatalogData(){
    this._genericService.setCatalogID(this.catalogID);
    this._metaDataService.getByID(this.catalogID)
      .subscribe(catalog =>{
        this.workingCatalog = catalog;
        if(this.workingCatalog.detailURL) this.detailURL = this.workingCatalog.detailURL;

        //Loads Data
        //It doesn't get GenericService since Type is unknown
        this._genericService.getList(false);

        //Gets Columns
        this._metaDataService.getFieldsList(this.catalogID)
          .subscribe((fields: MetaDataField[]) =>{
            this.dataSource.columns = fields.filter(f => f.visible )
              .map(fld => new TableColumn(fld.nombre, fld.nombreCorto, item => item[fld.nombreCorto]));
            this.dataSource.refresh();
          });
      });
  }

  createSubscriptions(){
    this.loading$.subscribe((isLoading: boolean) => this.loading = this._metaDataService.isLoading || this._genericService.isLoading);
    this._genericService.source$.subscribe((data: any[]) => { this.dataSource.updateDataSource(data) });
  }

  getFieldValue(item: any, property: string){ return item[property]; }

  onDelete(item: GenericCatalog | any){
    this.workingCatalog.referenceURL ? 
      this.fbGenericService.deleteCatalogItem(item.key) :
      this._genericService.delete(Number(item.key ? item.key : item.C0))
  }

  onEdit(item: GenericCatalog | any){
    this.router.navigate([`${this.detailURL}/${item.key ? item.key : item.C0}`]);
  }

  onAdd(){ this.router.navigate([`${this.detailURL}/0`]); }
}