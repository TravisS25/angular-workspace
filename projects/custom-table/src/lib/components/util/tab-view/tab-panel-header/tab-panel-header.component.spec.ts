import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPanelHeaderComponent } from './tab-panel-header.component';

describe('TabPanelHeaderComponent', () => {
  let component: TabPanelHeaderComponent;
  let fixture: ComponentFixture<TabPanelHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabPanelHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPanelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
