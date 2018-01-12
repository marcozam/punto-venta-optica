import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { StoreProceduresService } from 'app/modules/development/services/store-procedures.service';
import { StoreProcedureMetaData, StoreProcedureOptionMetaData } from 'app/modules/development/models/store-procedure.models';
import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';

@Component({
  selector: 'app-store-procedure-list',
  templateUrl: './store-procedure-list.component.html',
  styleUrls: ['./store-procedure-list.component.scss'],
  providers: [StoreProceduresService]
})
export class StoreProcedureListComponent implements OnInit, AfterViewInit {

  dataSource: TableSource<StoreProcedureMetaData>;
  showOptions: boolean = false;
  selectedItem: StoreProcedureMetaData;

  @ViewChild("actionsTemplate") 
  actionsTemplate: TemplateRef<any>;

  constructor(private _service: StoreProceduresService) { 
    //Creates Data Source
    this.dataSource = new TableSource();
    //Define filter function
    //this.dataSource.filter = () => { }
    //Defines Columns
    this.dataSource.columns = [
      new TableColumn( 'Nombre', 'nombre', (item) => item.nombre ),
      new TableColumn( 'Descripcion', 'descripcion', (item) => item.description )
    ]
    //Defines default sort
    this.dataSource.columns[0].sortOrder = 0;
    this.dataSource.columns[0].sortDirection = 'desc';
  }

  ngOnInit() {
    this.createSubscriptions();
    this._service.getList();
  }

  ngAfterViewInit(){
    //Set Template for Actions
    this.dataSource.actionsTemplate = this.actionsTemplate;
    this.dataSource.refresh();
  }

  createSubscriptions(){
    this._service.source$.subscribe((list: StoreProcedureMetaData[]) => {
      if(list.length > 0) this.dataSource.updateDataSource(list);
    })
  }

  onShowOption(item: StoreProcedureMetaData){
    console.log(item);
    this.showOptions = true;
    this.selectedItem = item;
    this._service.getOptionsList(Number(item.key))
      .subscribe((list: StoreProcedureOptionMetaData[]) => {
        item.options = list;
      })
  }
}
