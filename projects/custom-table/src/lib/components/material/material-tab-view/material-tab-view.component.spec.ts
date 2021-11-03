import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTabViewComponent } from './material-tab-view.component';

describe('MaterialTabViewComponent', () => {
  let component: MaterialTabViewComponent;
  let fixture: ComponentFixture<MaterialTabViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTabViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTabViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
