import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenPresupuestoComponent } from './examen-presupuesto.component';

describe('ExamenPresupuestoComponent', () => {
  let component: ExamenPresupuestoComponent;
  let fixture: ComponentFixture<ExamenPresupuestoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamenPresupuestoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamenPresupuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
