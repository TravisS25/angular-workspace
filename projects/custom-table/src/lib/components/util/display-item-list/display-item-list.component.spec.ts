import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemListComponent } from './display-item-list.component';

describe('DisplayItemListComponent', () => {
  let component: DisplayItemListComponent;
  let fixture: ComponentFixture<DisplayItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayItemListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
