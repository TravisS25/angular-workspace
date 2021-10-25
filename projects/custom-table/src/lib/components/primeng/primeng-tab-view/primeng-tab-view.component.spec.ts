import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengTabViewComponent } from './primeng-tab-view.component';

describe('PrimengTabViewComponent', () => {
  let component: PrimengTabViewComponent;
  let fixture: ComponentFixture<PrimengTabViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimengTabViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimengTabViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
