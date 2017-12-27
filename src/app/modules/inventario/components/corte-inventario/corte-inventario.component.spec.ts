import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorteInventarioComponent } from './corte-inventario.component';

describe('CorteInventarioComponent', () => {
  let component: CorteInventarioComponent;
  let fixture: ComponentFixture<CorteInventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorteInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorteInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
