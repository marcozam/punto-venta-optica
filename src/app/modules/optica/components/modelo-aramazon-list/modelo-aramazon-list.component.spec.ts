import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeloAramazonListComponent } from './modelo-aramazon-list.component';

describe('ModeloAramazonListComponent', () => {
  let component: ModeloAramazonListComponent;
  let fixture: ComponentFixture<ModeloAramazonListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModeloAramazonListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeloAramazonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
