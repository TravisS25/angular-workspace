import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDisplayInfoComponent } from './mobile-display-info.component';

describe('MobileDisplayInfoComponent', () => {
  let component: MobileDisplayInfoComponent;
  let fixture: ComponentFixture<MobileDisplayInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileDisplayInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDisplayInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
