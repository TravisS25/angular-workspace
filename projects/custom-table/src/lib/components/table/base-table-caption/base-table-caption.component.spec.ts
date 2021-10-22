import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTableCaptionComponent } from './base-table-caption.component';

describe('BaseTableCaptionComponent', () => {
  let component: BaseTableCaptionComponent;
  let fixture: ComponentFixture<BaseTableCaptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseTableCaptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseTableCaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
