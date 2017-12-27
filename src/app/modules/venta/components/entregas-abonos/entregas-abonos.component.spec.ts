import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasAbonosComponent } from './entregas-abonos.component';

describe('EntregasAbonosComponent', () => {
  let component: EntregasAbonosComponent;
  let fixture: ComponentFixture<EntregasAbonosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntregasAbonosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregasAbonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
