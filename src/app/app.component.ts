import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
// Dialog
import { SucursalSelectionComponent } from './sucursal-selection/sucursal-selection.component';
import { ApplicationService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  constructor(titleService: Title, router: Router, private dialog: MatDialog, private applicationService: ApplicationService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(router.routerState, router.routerState.root).join('-');
        titleService.setTitle(this.appName + ' :: ' + title);
        this.setTitle(title);
      }
    });
  }

  appName = 'OS';
  title = 'OS';

  getTitle(state, parent) {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }
    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  setTitle(pTitle) { this.title = pTitle; }

  ngOnInit() {
    if (!this.applicationService.sucursal) {
      this.dialog.open(SucursalSelectionComponent, {
        width: '200px',
        hasBackdrop: false,
      });
    }
  }
}
