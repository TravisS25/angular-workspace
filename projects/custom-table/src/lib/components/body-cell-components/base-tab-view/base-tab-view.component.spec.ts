import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTabViewComponent } from './base-tab-view.component';

describe('BaseTabViewComponent', () => {
  let component: BaseTabViewComponent;
  let fixture: ComponentFixture<BaseTabViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseTabViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseTabViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
