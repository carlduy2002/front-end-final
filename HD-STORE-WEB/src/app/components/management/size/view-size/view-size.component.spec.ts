import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSizeComponent } from './view-size.component';

describe('ViewSizeComponent', () => {
  let component: ViewSizeComponent;
  let fixture: ComponentFixture<ViewSizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSizeComponent]
    });
    fixture = TestBed.createComponent(ViewSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
