import { Subject } from "rxjs/Subject";
import { TemplateRef } from "@angular/core/src/linker/template_ref";

export type SortDirection = 'asc' | 'desc' | 'none';
export type ColumnAlign = 'left' | 'center' | 'right';

export class TableColumn {
    sortDirection: SortDirection = 'none';
    sortOrder: number = -1;
    sum: boolean;
    align: ColumnAlign = 'left';
    filterTemplate?: TemplateRef<any>;
    columnTemplate?: TemplateRef<any>;

    constructor(
        public header: string, 
        public uniqueID: string, 
        public description: any,
        _suma: boolean = false,
        public sumTemplate?: any)
    {
        this.sum = _suma;
        if(_suma) this.align = 'right';
    }
}

export class TableSource<T> {
    private _data: T[] = [];
    private _filteredData: T[] = [];

    //Method to clear
    filter: any;
    actionsTemplate?: TemplateRef<any>;
    onDataSourceChange: Subject<any> = new Subject();

    get visibleData(): T[]{
        const sIdx = (this.pagingSettings.currentPage - 1) * this.pagingSettings.itemsPerPage;
        const eIdx = Math.min(((this.pagingSettings.currentPage) * this.pagingSettings.itemsPerPage) - 1, this.pagingSettings.itemsCount);
        return this._filteredData.filter( (item, idx)=> {
            if(idx >= sIdx && idx <= eIdx) return item;
        });
    }

    get data(): T[] {
        return this._data;
    }

    get hasFilter(): boolean {
        return this._filteredData.length < this.data.length;
    }

    columns: TableColumn[];
    pagingSettings: TablePagingSettings;

    constructor() {
        this.columns = [];
        this.pagingSettings = new TablePagingSettings(25, this.data ? this.data.length : 0, 5);
    }

    updateDataSource(data: T[]){
        this._data = data;
        this.refresh();
    }

    refresh(){
        this.applySort();
        this.applyFilters();
    }

    suma(column: TableColumn){
        let items = this.data;
        if(items.length > 1){
            return items.map(item => column.sumTemplate(item))
                .reduce((p, n) => p + n)
        }
        else if(items.length > 0) {
            return column.sumTemplate(items[0])
        }
        else return 0;
    }

    deleteItem(item: T){
        let idx = this._data.indexOf(item);
        this._data.splice(idx, 1);
        this.refresh();
    }

    //Sorting
    togleSort(column: TableColumn){
        let newDirection: SortDirection;
        switch(column.sortDirection){
            case 'none':
                newDirection = 'desc';
                break;
            case 'desc':
                newDirection = 'asc';
                break;
            case 'asc':
                newDirection = 'none';
                break;
        }
        if(newDirection === 'none'){
            column.sortOrder = -1;
        }
        column.sortDirection = newDirection;
        return column;
    }
    
    getSortedColumns(){
        const sortedColumns = this.columns
            .filter(c=> c.sortDirection !== 'none')
            .sort(c=> c.sortOrder);
        let addedItems: number = 0;
        sortedColumns.forEach((col: TableColumn, idx: number) => {
            col.sortOrder = col.sortOrder < 0 ? (sortedColumns.length - ++addedItems) : idx - addedItems;
        })
        return sortedColumns.sort(c=> c.sortOrder);;
    }

    applySort(){
        const sortedColumns = this.getSortedColumns();
        const nSorts = sortedColumns.length;
        if(nSorts > 0)
        {
            this.data.sort((a, b) => {
                let retVal = 0, idx = 0;
                while(retVal === 0 && idx < nSorts){
                const col = sortedColumns[idx++];
                const d = col.sortDirection === 'desc' ? 1 : -1;
                const val1 = col.description(a);
                const val2 = col.description(b);
                if(val1 < val2) retVal = -1 * d;
                if(val1 > val2) retVal = 1 * d;
                }
                return retVal;
            });
        }
    }

    //Filters
    cleanFilters(){
        this._filteredData = this.data;
        this.onDataSourceChange.next(this._filteredData);
    }

    applyFilters(){
        this._filteredData = this.filter ? this.filter() : this.data;
        this.pagingSettings.itemsCount = this._filteredData.length;
        if(this.pagingSettings.lastPage){
            this.pagingSettings.currentPage = this.pagingSettings.totalPages;
        }
        this.onDataSourceChange.next(this._filteredData);
    }
}

export class TablePagingSettings{
    currentPage: number;

    constructor(
        public itemsPerPage: number, 
        public itemsCount: number,
        public pagesToShow: number
    ){
        this.currentPage = 1;
    }

    get lastPage(): boolean{
        return this.currentPage >= this.totalPages;
    }

    get totalPages(): number{
        return Math.ceil(this.itemsCount/this.itemsPerPage) || 1;
    }

    get pages(): number[]{
        const pages: number[] = [];
        const p = this.currentPage;
        const c = this.totalPages;
        pages.push(p);
        const times = this.pagesToShow - 1;
        for (let i = 0; i < times; i++) {
            if (pages.length < this.pagesToShow) {
                if (Math.min.apply(null, pages) > 1) {
                    pages.push(Math.min.apply(null, pages) - 1);
                }
            }
            if (pages.length < this.pagesToShow) {
                if (Math.max.apply(null, pages) < c) {
                    pages.push(Math.max.apply(null, pages) + 1);
                }
            }
        }
        pages.sort((a, b) => a - b);
        return pages;
    }
}