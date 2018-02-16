import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ContentChildren,
  QueryList,
} from '@angular/core';
// Componets
import { FilterComponent } from 'app/modules/base/components/filter/filter.component';
// Models
import { TableSource, TableColumn } from 'app/modules/base/models/data-source.models';
// Services
import { DialogBoxService } from 'app/modules/base/services/dialog-box.service';

import { WarningTitle } from 'app/modules/base/constants/messages.contants';

@Component({
  selector: 'os-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DialogBoxService
  ]
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input()
  dataSource: TableSource<any>;
  @Input()
  canEdit: boolean = true;
  @Input()
  canDelete: boolean = true;
  @Input()
  canAdd: boolean = true;
  @Input()
  loading: boolean = false;
  @ContentChildren(FilterComponent)
  _filters: QueryList<FilterComponent>;

  filterVisible: boolean = false;

  //Events
  @Output()
  onAddFired: EventEmitter<any> = new EventEmitter();
  @Output()
  onDeleteFired: EventEmitter<any> = new EventEmitter();
  @Output()
  onEditFired: EventEmitter<any> = new EventEmitter();

  constructor(
    private dialogService: DialogBoxService,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.dataSource.onDataSourceChange.subscribe(()=>{
      this.cd.detectChanges();
    })
  }

  ngAfterViewInit(){
    this.dataSource.columns.forEach(col=>{
      let _filter = this._filters.find(f=> f.uniqueID === col.uniqueID);
      if(_filter){
        col.filterTemplate = _filter.template;
      }
    });
  }

  onAdd(){
    this.onAddFired.emit();
  }

  onEdit(item){
    this.onEditFired.emit(item);
  }

  onDelete(item){
    this.dialogService.openDialog(WarningTitle, 
    `Esta seguro que desea eliminar:.${item.nombre}.No podran revertir sus cambios`, true, (r)=>{
      if(r){
        this.onDeleteFired.emit(item);
      }
    });
  }

  toggleFilters(){
    this.filterVisible = !this.filterVisible;
  }

  sort(column: TableColumn){
    if(!this.filterVisible){
      column = this.dataSource.togleSort(column);
      this.dataSource.applySort();
    }
  }
}
