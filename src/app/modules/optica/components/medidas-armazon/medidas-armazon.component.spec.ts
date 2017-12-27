import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedidasArmazonComponent } from './medidas-armazon.component';

describe('MedidasArmazonComponent', () => {
  let component: MedidasArmazonComponent;
  let fixture: ComponentFixture<MedidasArmazonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedidasArmazonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedidasArmazonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
