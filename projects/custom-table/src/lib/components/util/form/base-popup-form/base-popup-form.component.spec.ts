import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePopupFormComponent } from './base-popup-form.component';

describe('BasePopupFormComponent', () => {
  let component: BasePopupFormComponent;
  let fixture: ComponentFixture<BasePopupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasePopupFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasePopupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
