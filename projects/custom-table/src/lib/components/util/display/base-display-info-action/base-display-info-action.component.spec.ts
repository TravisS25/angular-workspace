import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDisplayInfoActionComponent } from './base-display-info-action.component';

describe('BaseDisplayInfoActionComponent', () => {
  let component: BaseDisplayInfoActionComponent;
  let fixture: ComponentFixture<BaseDisplayInfoActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseDisplayInfoActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDisplayInfoActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
