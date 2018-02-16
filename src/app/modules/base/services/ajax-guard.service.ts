import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { AjaxRequestResult } from 'app/modules/base/models/request.models';

const queuedConnections: Observable<Object>[] = [];

@Injectable()
export class AjaxGuardService {
    online$: Observable<boolean>;

    constructor(private _http: HttpClient) {
        // Check if Browser is online
        this.online$ = Observable.merge(
            Observable.of(navigator.onLine),
            Observable.fromEvent(window, 'online').mapTo(true),
            Observable.fromEvent(window, 'offline').mapTo(false)
        );
    }

    private encodeObject(obj) {
        let str = [];
        // tslint:disable-next-line:forin
        Object.keys(obj).forEach(p => {
            str = str.concat([`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`]);
        });
        return str.join('&');
    }

    getData(url: string, data: any) {
        const post = this._http.post(url, this.encodeObject(data), {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        });
        const response: Subject<AjaxRequestResult> = new Subject();
        // Execute on complete
        response.subscribe(() => {
            const index = queuedConnections.indexOf(post);
            if (index > -1) { queuedConnections.splice(index, 1); }
        });

        queuedConnections.push(post);
        post.subscribe((result: any) => {
                const rr = new AjaxRequestResult(result.Auth ? 'AuthError' : 'Success', result);
                response.next(rr);
            },
            (error: any) => {
                const rr = new AjaxRequestResult('GeneralError', error);
                response.next(rr);
            }
        );
        return response;
    }
}
