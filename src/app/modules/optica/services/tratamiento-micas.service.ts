import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { TratamientoMica, TratamientoMicaPrecios } from '../models/examen.models'

import { FBGenericService } from '../../generic-catalogs/services/fb-generic.service';
import { GenericService } from '../../generic-catalogs/services/generic.service';

@Injectable()
export class TratamientoMicasService extends FBGenericService {
  constructor(_db: AngularFireDatabase) { 
    super(_db)
    super.setListRefURL('micas/tratamientos');
  }
}