import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengTabPanelHeaderComponent } from './primeng-tab-panel-header.component';

describe('PrimengTabPanelHeaderComponent', () => {
  let component: PrimengTabPanelHeaderComponent;
  let fixture: ComponentFixture<PrimengTabPanelHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimengTabPanelHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimengTabPanelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
