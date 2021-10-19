import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialMobileTableComponent } from './material-mobile-table.component';

describe('MaterialMobileTableComponent', () => {
  let component: MaterialMobileTableComponent;
  let fixture: ComponentFixture<MaterialMobileTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialMobileTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialMobileTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
