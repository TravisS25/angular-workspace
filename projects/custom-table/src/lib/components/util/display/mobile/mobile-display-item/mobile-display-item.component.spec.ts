import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDisplayItemComponent } from './mobile-display-item.component';

describe('MobileDisplayItemComponent', () => {
  let component: MobileDisplayItemComponent;
  let fixture: ComponentFixture<MobileDisplayItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileDisplayItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDisplayItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
