import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorteListComponent } from './corte-list.component';

describe('CorteListComponent', () => {
  let component: CorteListComponent;
  let fixture: ComponentFixture<CorteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
