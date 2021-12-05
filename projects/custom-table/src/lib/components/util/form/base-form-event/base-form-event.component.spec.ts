import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFormEventComponent } from './base-form-event.component';

describe('BaseFormEventComponent', () => {
  let component: BaseFormEventComponent;
  let fixture: ComponentFixture<BaseFormEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseFormEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFormEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
