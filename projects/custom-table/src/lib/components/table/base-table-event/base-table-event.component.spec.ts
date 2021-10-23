import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTableEventComponent } from './base-table-event.component';

describe('BaseTableEventComponent', () => {
  let component: BaseTableEventComponent;
  let fixture: ComponentFixture<BaseTableEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseTableEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseTableEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
