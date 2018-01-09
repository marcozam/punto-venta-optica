import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//Services
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { GenericCatalogService } from 'app/modules/generic-catalogs/services/generic.service';
import { _catalogs, CatalogsMetadataService } from 'app/modules/generic-catalogs/services/catalogs-metadata.service';
import { FBGenericService } from 'app/modules/generic-catalogs/services/fb-generic.service';
//Models
import { BaseGenericCatalog, GenericCatalog } from '../../models/generic-catalogs.models';
import { MetaDataCatalog, MetaDataField } from '../../models/metadata-catalogs.models';
import { TableSource, TableColumn } from 'app/modules/base/models/base.models';

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
    private fbGenericService: FBGenericService,
    private route: ActivatedRoute, 
    private router: Router,
    public dialog: DialogBoxService) { 
  }

  ngOnInit() { 
    //Observer when app is retriving data
    this.loading$ = Observable.merge(this._metaDataService.loading$);

    this.createSubscriptions();

    this.route.params.subscribe((params)=>{
      this.catalogID = params['catalogID'];
      this.cleanData();

      this.workingCatalog = _catalogs.find(c=> c.key === this.catalogID);
      //Se Trabaja con FireBase
      if(this.workingCatalog){
        this.dataSource.columns = [ new TableColumn('Nombre', 'nombre', (item: GenericCatalog)=> item.nombre)];
        if(this.workingCatalog.detailURL) this.detailURL = this.workingCatalog.detailURL;
        this.fbGenericService.setListRefURL(this.workingCatalog.referenceURL);
        this.fbGenericService.getCatalogList(result => this.dataSource.updateDataSource(result), true)
      }
      //Trabajar con SQL
      else this.loadCatalogData();
    });
  }

  cleanData(){
    this.detailURL = `/catalogo/${this.catalogID}/`;
    this.dataSource = new TableSource();
  }

  loadCatalogData(){
    this._genericService.setCatalogID(this.catalogID);
    this._metaDataService.getByID(this.catalogID)
      .subscribe(catalog =>{
        this.workingCatalog = catalog;
        //IF has detail URL updated

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
    this.loading$.subscribe((isLoading: boolean) => this.loading = this._metaDataService.isLoading);
    this._genericService.source$.subscribe((data: any[]) => { 
      console.log('Updating Data:', data);
      this.dataSource.updateDataSource(data)
    });
  }

  getFieldValue(item: any, property: string){
    return item[property];
  }

  onDelete(item: GenericCatalog | any){
    console.log('Current Data:', this.dataSource.data);
    this.workingCatalog.referenceURL ? 
      this.fbGenericService.deleteCatalogItem(Number(item.key)) : 
      this._genericService.delete(Number(item.key ? item.key : item.C0))
  }

  onEdit(item: GenericCatalog | any){
    this.router.navigate([`${this.detailURL}/${item.key ? item.key : item.C0}`]);
  }

  onAdd(){
    this.router.navigate([`${this.detailURL}/0`]);
  }
}