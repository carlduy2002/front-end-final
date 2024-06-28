import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOldPasswordComponent } from './check-old-password.component';

describe('CheckOldPasswordComponent', () => {
  let component: CheckOldPasswordComponent;
  let fixture: ComponentFixture<CheckOldPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckOldPasswordComponent]
    });
    fixture = TestBed.createComponent(CheckOldPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
