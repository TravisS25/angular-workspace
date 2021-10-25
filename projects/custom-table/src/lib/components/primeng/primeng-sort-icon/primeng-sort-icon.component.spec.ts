import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengSortIconComponent } from './primeng-sort-icon.component';

describe('PrimengSortIconComponent', () => {
  let component: PrimengSortIconComponent;
  let fixture: ComponentFixture<PrimengSortIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimengSortIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimengSortIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
