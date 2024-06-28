import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductSearchComponent } from './view-product-search.component';

describe('ViewProductSearchComponent', () => {
  let component: ViewProductSearchComponent;
  let fixture: ComponentFixture<ViewProductSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProductSearchComponent]
    });
    fixture = TestBed.createComponent(ViewProductSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
