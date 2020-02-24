import { Injectable } from '@angular/core';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';

@Injectable()
export class LoginService {

    constructor(private db: BaseAjaxService) { }

    login(username: string, password: string) {
      const params = this.db.createParameter('SYS0001', 1, {
        V7: username,
        V8: password
      });
      return this.db.getData(params);
    }
}
