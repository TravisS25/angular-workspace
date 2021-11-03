import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDisplayTextComponent } from './base-display-text.component';

describe('BaseDisplayTextComponent', () => {
  let component: BaseDisplayTextComponent;
  let fixture: ComponentFixture<BaseDisplayTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseDisplayTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDisplayTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
