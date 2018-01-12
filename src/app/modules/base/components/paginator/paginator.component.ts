import { Component, OnInit, Input } from '@angular/core';
import { TablePagingSettings } from 'app/modules/base/models/data-source.models';

@Component({
  selector: 'os-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  @Input()
  pagingSettings: TablePagingSettings;

  @Input()
  columns: number;

  constructor() { }

  ngOnInit() {
  }

  nextPage(){
    if(!this.pagingSettings.lastPage)
      this.pagingSettings.currentPage++;
  }

  prevPage(){
    if(this.pagingSettings.currentPage > 1)
      this.pagingSettings.currentPage--;
  }
}
