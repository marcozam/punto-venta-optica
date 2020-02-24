import { Injectable } from '@angular/core';
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { User } from 'models';

@Injectable()
export class LoginService {

    constructor(private db: BaseAjaxService) { }

    login(username: User, password: string) {
      const params = this.db.createParameter('SYS0001', 1, {
        V8: username,
        V9: password
      });
      return this.db.getData(params);
    }
}
