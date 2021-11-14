import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialMobileRowDisplayItemComponent } from './material-mobile-row-display-item.component';

describe('MaterialMobileRowDisplayItemComponent', () => {
  let component: MaterialMobileRowDisplayItemComponent;
  let fixture: ComponentFixture<MaterialMobileRowDisplayItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialMobileRowDisplayItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialMobileRowDisplayItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
