import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericCatalog } from 'app/modules/base/models/base.models';
import { MetaDataCatalog } from '../../models/metadata-catalogs.models';
import { FBGenericService } from '../../services/fb-generic.service';
import { GenericCatalogService } from '../../services/generic.service';
import { _catalogs } from '../../services/catalogs-metadata.service';

@Component({
  selector: 'app-generic-catalog',
  templateUrl: './generic-catalog.component.html',
  styleUrls: ['./generic-catalog.component.scss'],
  providers: [GenericCatalogService, DialogBoxService, FBGenericService]
})
export class GenericCatalogComponent implements OnInit {

  catalogID: string;
  item: GenericCatalog;
  catalog: MetaDataCatalog;

  constructor(
    private genericService: GenericCatalogService,
    private fbGenericService: FBGenericService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: DialogBoxService) { 
    this.item = new GenericCatalog();
  }

  ngOnInit() {
    this.catalogID = this.route.snapshot.params['catalogID'];
    let _detailID = this.route.snapshot.params['detailID'];
    
    this.catalog = _catalogs.find(c=> c.key === this.catalogID);
    if(this.catalog){
      this.fbGenericService.setListRefURL(this.catalog.referenceURL);
      if(_detailID > 0){
        this.fbGenericService.getCatalogItem(_detailID, data=> this.item = data);
      }
    }
    else{
      this.genericService.setCatalogID(Number(this.catalogID));
      if(_detailID > 0){
        this.genericService.getByID(_detailID).subscribe(data=> this.item = data);
      }
    }
  }

  onSave(newValue: GenericCatalog){
    if(this.catalog){
      this.fbGenericService.save(this.item, newValue);
      this.dialog.openDialog('Registro exitoso!', 'La informacion se ha guardado con exito.', false);
    }
    else{
      this.genericService.save(newValue, () =>{
        this.dialog.openDialog('Registro exitoso!', 'La informacion se ha guardado con exito.', false);
      });
    }
    let _url = '/catalogo/' + this.catalogID;
    this.router.navigate([_url]);
  }
}