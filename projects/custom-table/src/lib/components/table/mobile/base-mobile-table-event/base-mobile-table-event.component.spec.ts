import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMobileTableEventComponent } from './base-mobile-table-event.component';

describe('BaseMobileTableEventComponent', () => {
  let component: BaseMobileTableEventComponent;
  let fixture: ComponentFixture<BaseMobileTableEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseMobileTableEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMobileTableEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
