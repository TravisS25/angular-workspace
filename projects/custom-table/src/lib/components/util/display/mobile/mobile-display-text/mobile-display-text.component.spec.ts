import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDisplayTextComponent } from './mobile-display-text.component';

describe('MobileDisplayTextComponent', () => {
  let component: MobileDisplayTextComponent;
  let fixture: ComponentFixture<MobileDisplayTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileDisplayTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDisplayTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
