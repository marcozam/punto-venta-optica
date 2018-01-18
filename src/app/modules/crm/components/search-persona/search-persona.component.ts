import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ContactoService } from '../../services/contacto.service';
import { PersonasService } from 'app/modules/base/services/personas.service';
import { Contacto } from 'app/modules/crm/models/crm.models';
import { Persona } from 'app/modules/base/models/base.models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-search-persona',
  templateUrl: './search-persona.component.html',
  styleUrls: ['./search-persona.component.scss'],
  providers: [PersonasService, ContactoService]
})
export class SearchPersonaComponent implements OnInit {

  resultados: Contacto[] = [];
  triggerSearch: Boolean = false;
  showAdd:Boolean = false;
  _contacto: Contacto;
  loading$: Observable<boolean>;
  isLoading: boolean = false;
  contactoID: number;

  @Input() catalogName: string;
  @Output() onChange = new EventEmitter<any>();

  constructor(private _contactoService: ContactoService) {
    this.loading$ = this._contactoService.loading$;
  }

  createSubscriptions(){
    this.loading$.subscribe((isLoading: boolean) => {
      this.isLoading = this._contactoService.isLoading;
    });

    this._contactoService.source$.subscribe(data => this.resultados = data);
  }  

  ngOnInit() {
    this.createSubscriptions();
  }

  onSearch(_nombre: string){
    _nombre = _nombre.trim();
    let _names = _nombre.split(',');
    if(_names.length >= 2) {
      this.isLoading = true;
      this._contactoService.getPersonaByName(_names[1], _names[0]);
      this.triggerSearch = true;
    }
  }

  onItemSelected(item: Contacto){
    this.onChange.emit({data: item, exist: true});
  }

  onViewContactClick(item: Contacto){
    this.contactoID = item.key;
    this.showAdd = true;
  }

  onAddClick(_nombre:string){
    if(!_nombre) _nombre = ',';
    let _names = _nombre.split(',');
    let $persona = new Persona();
    $persona.nombre = _names[0].trim();
    $persona.apellidoPaterno = _names[1].trim();
    this.showAdd = true;
    this._contacto = new Contacto();
    this._contacto.persona = $persona;
  }

  personaAdded(data: any){
    this.showAdd = false;
    this.onChange.emit({data: data.Data, exist: data.isNew});
  }
}
