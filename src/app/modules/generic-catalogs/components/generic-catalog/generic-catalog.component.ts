import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericCatalog } from 'app/modules/base/models/base.models';
import { MetaDataCatalog, MetaDataField } from '../../models/metadata-catalogs.models';
import { FBGenericService } from '../../services/fb-generic.service';
import { GenericCatalogService } from '../../services/generic.service';
import { _catalogs, CatalogsMetadataService } from '../../services/catalogs-metadata.service';
import { Subject } from 'rxjs/Subject';
import { SuccessTitle, SuccessMessage } from 'app/modules/base/constants/messages.contants';

@Component({
  selector: 'app-generic-catalog',
  templateUrl: './generic-catalog.component.html',
  styleUrls: ['./generic-catalog.component.scss'],
  providers: [GenericCatalogService, DialogBoxService, CatalogsMetadataService, FBGenericService]
})
export class GenericCatalogComponent implements OnInit {

  catalogID: number;
  item: GenericCatalog;
  catalog: MetaDataCatalog;

  constructor(
    private genericService: GenericCatalogService,
    private fbGenericService: FBGenericService<GenericCatalog>,
    private _metaDataService: CatalogsMetadataService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: DialogBoxService) { 
    this.item = new GenericCatalog();
  }

  ngOnInit() {
    this.catalogID = Number(this.route.snapshot.params['catalogID']);
    let _detailID = this.route.snapshot.params['detailID'];
    
    this.catalog = _catalogs.find(c=> c.key === this.catalogID);

    //FB
    if(this.catalog){
      this.fbGenericService.setListRefURL(this.catalog.referenceURL);
      if(_detailID > 0) this.fbGenericService.getCatalogItem(_detailID, data => this.item = data);
    }
    //SQL
    else{
      this._metaDataService.getByID(this.catalogID)
        .subscribe((result)=>{
          this.catalog = result;
          this.loadInitialData(_detailID).subscribe(data=> this.item = data);
        })
    }
  }

  loadInitialData(_detailID: any){
    let respond$: Subject<GenericCatalog> = new Subject();
    this.genericService.setCatalogID(this.catalogID);
    this._metaDataService.getFieldsList(this.catalogID)
      .subscribe((fields: MetaDataField[]) =>{
        this.genericService.fields = fields;
        if(_detailID > 0) this.genericService.getByID(_detailID).subscribe(data => respond$.next(data));
      });
    return respond$.asObservable();
  }

  onSave(newValue: GenericCatalog){
    if(this.catalog){
      this.fbGenericService.save(this.item, newValue);
      this.dialog.openDialog(SuccessTitle, SuccessMessage, false);
    }
    else{
      this.genericService.save(newValue, this.item)
        .subscribe(() =>{
          this.dialog.openDialog(SuccessTitle, SuccessMessage, false);
        });
    }
    let _url = this.catalog.listURL ? this.catalog.listURL : '/catalogo/' + this.catalogID;
    this.router.navigate([_url]);
  }
}