import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Router, ActivatedRoute,NavigationEnd,Event } from '@angular/router';
import { Title } from '@angular/platform-browser';

//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent{
  constructor(titleService:Title, router:Router, activatedRoute:ActivatedRoute) {
    router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        let title = this.getTitle(router.routerState, router.routerState.root).join('-');
        titleService.setTitle(this.appName + ' :: ' + title);
        this.setTitle(title);
      }
    });
  }
  
  appName = 'OS';
  title = 'OS';
  
  getTitle(state, parent) {
    let data = [];
    if(parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }
    if(state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }
  
  setTitle(pTitle){
    this.title = pTitle;
  }
}
