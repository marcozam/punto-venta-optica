import { Component, OnInit, Input } from '@angular/core';
// Models
import { TableSource, GroupData, TableColumn } from 'app/modules/base/models/data-source.models';

@Component({
  selector: 'os-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss']
})
export class GroupTableComponent implements OnInit {

  @Input() dataSource: TableSource<any>;
  groups: GroupData[];

  groupingColumns: TableColumn[];

  constructor() { }

  ngOnInit() {
    this.groupingColumns = this.dataSource.columns.filter(col => col.group);
    if (this.dataSource.data.length > 0) {
      this.createGroup(this.dataSource.data);
    }
    this.dataSource.onDataSourceChange.subscribe(data => {
      if (this.groupingColumns.length > 0) {
        this.createGroup(data);
      }
    });
  }


  createGroup(values: any[]) {
    const column = this.groupingColumns[0];
    const uniqueValues = this.uniqueValues(column, values);

    const groups = uniqueValues.map(val => {
      const gds = new TableSource();
      gds.columns = this.dataSource.columns.filter(col => col.uniqueID !== column.uniqueID);
      gds.updateDataSource(this.dataSource.data.filter(item => column.description(item) === val));
      return new GroupData(val, gds);
    });
    this.groups = groups;
  }

  uniqueValues(column: TableColumn, values: any[]) {
    const list = values.map(item => column.description(item));
    return Array.from(new Set(list));
  }
}
