import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDisplayComponent } from './base-display.component';

describe('BaseDisplayComponent', () => {
  let component: BaseDisplayComponent;
  let fixture: ComponentFixture<BaseDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
