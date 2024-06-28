import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSizeComponent } from './update-size.component';

describe('UpdateSizeComponent', () => {
  let component: UpdateSizeComponent;
  let fixture: ComponentFixture<UpdateSizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSizeComponent]
    });
    fixture = TestBed.createComponent(UpdateSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
