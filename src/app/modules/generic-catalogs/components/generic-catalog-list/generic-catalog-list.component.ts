import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseGenericCatalog, GenericCatalog } from '../../models/generic-catalogs.models';
import { MetaDataCatalog, MetaDataField } from '../../models/metadata-catalogs.models';

import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { GenericCatalogService } from 'app/modules/generic-catalogs/services/generic.service';
import { _catalogs, CatalogsMetadataService } from 'app/modules/generic-catalogs/services/catalogs-metadata.service';
import { FBGenericService } from 'app/modules/generic-catalogs/services/fb-generic.service';

@Component({
  selector: 'app-generic-catalog-list',
  templateUrl: './generic-catalog-list.component.html',
  styleUrls: ['./generic-catalog-list.component.scss'],
  providers: [GenericCatalogService, CatalogsMetadataService, DialogBoxService, FBGenericService]
})
export class GenericCatalogListComponent implements OnInit {
  catalogID: any;
  dataList: GenericCatalog[];
  detailURL: string = '';

  fields: MetaDataField[];
  workingCatalog: MetaDataCatalog;

  constructor(
    private genericService: GenericCatalogService, 
    private fbGenericService: FBGenericService,
    private _db: CatalogsMetadataService,
    private route: ActivatedRoute, 
    public dialog: DialogBoxService) { 
  }

  ngOnInit() { 
    this.route.params.subscribe((params)=>{
      this.detailURL = '';
      this.catalogID = params['catalogID'];
      this.workingCatalog = _catalogs.find(c=> c.key === this.catalogID);
      //Se Trabaja con FireBase
      if(this.workingCatalog){
        let _fld = new MetaDataField();
        _fld.nombre = 'Nombre';
        _fld.nombreCorto = 'nombre';
        this.fields = [_fld];
        if(this.workingCatalog.detailURL){
          this.detailURL = this.workingCatalog.detailURL
        }
        this.fbGenericService.setListRefURL(this.workingCatalog.referenceURL);
        this.fbGenericService.getCatalogList(r=>{
          this.dataList = r;
        }, true)
      }
      //Trabajar con SQL
      else {
        this.dataList = [];
        this.workingCatalog = Object.assign(new MetaDataCatalog(), { nombre: 'Generic'});
        this._db.getFieldsList(this.catalogID, (r: MetaDataField[]) =>{
          this.fields = r.filter(f => f.visible );
          this._db.getCatalogData(this.catalogID, data => {
            this.dataList = data;
          });
        });
      }
    });
  }

  getFieldValue(item: any, property: string){
    return item[property];
  }

  onDelete(item: GenericCatalog){
    //this.workingCatalog.referenceURL ? this.fbGenericService.deleteCatalogItem(Number(item.key)) : this.genericService.delete(Number(item.key))
  }
}