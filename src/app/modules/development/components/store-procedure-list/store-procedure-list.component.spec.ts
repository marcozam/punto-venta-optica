import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProcedureListComponent } from './store-procedure-list.component';

describe('StoreProcedureListComponent', () => {
  let component: StoreProcedureListComponent;
  let fixture: ComponentFixture<StoreProcedureListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreProcedureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreProcedureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
