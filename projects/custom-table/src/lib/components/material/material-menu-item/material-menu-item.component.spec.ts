import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialMenuItemComponent } from './material-menu-item.component';

describe('MaterialMenuItemComponent', () => {
  let component: MaterialMenuItemComponent;
  let fixture: ComponentFixture<MaterialMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialMenuItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
