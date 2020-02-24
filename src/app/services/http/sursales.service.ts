import { Injectable } from '@angular/core';
// RxJs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Models
import { Sucursal } from 'models';

import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

@Injectable()
export class SucursalService {

  constructor(private db: BaseAjaxService) { }

  getList(): Observable<Sucursal[]> {
    return this.db.getAllDataFromCatalog(99).pipe(
      map(result => result.map(({C0, C1, C2}) => ({
        key: C0,
        nombre: C1,
        domicilioUuid: C2,
        company: {
          key: 1,
          name: 'OPTIKA',
        }
      })))
    );
  }
}
