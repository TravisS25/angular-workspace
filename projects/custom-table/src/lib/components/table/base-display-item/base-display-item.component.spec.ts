import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDisplayItemComponent } from './base-display-item.component';

describe('BaseDisplayItemComponent', () => {
  let component: BaseDisplayItemComponent;
  let fixture: ComponentFixture<BaseDisplayItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseDisplayItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDisplayItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
