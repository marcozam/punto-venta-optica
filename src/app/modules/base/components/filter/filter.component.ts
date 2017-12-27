import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'os-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Input()
  uniqueID: string;

  @ViewChild('filterTemplate')
  template: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
    
  }

  onFilterChange(event){
    console.log('Filter Change', event)
  }
}
