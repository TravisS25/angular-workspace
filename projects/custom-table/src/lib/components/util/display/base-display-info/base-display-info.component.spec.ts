import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDisplayInfoComponent } from './base-display-info.component';

describe('BaseDisplayInfoComponent', () => {
  let component: BaseDisplayInfoComponent;
  let fixture: ComponentFixture<BaseDisplayInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseDisplayInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDisplayInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
