import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTabPanelHeaderComponent } from './material-tab-panel-header.component';

describe('MaterialTabPanelHeaderComponent', () => {
  let component: MaterialTabPanelHeaderComponent;
  let fixture: ComponentFixture<MaterialTabPanelHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTabPanelHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTabPanelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
