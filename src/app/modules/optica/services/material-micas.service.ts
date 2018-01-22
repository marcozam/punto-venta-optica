import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { MaterialMica } from '../models/examen.models';
import { FBGenericService } from '../../generic-catalogs/services/fb-generic.service';
import { GenericService, GenericServiceBase } from '../../generic-catalogs/services/generic.service';

@Injectable()
export class MaterialMicasService extends FBGenericService<MaterialMica> {
  constructor(_db: AngularFireDatabase) { 
    super(_db);
    super.setListRefURL('micas/materiales');
  }
}
