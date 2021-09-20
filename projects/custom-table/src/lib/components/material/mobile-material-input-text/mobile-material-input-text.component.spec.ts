import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMaterialInputTextComponent } from './mobile-material-input-text.component';

describe('MobileMaterialInputTextComponent', () => {
  let component: MobileMaterialInputTextComponent;
  let fixture: ComponentFixture<MobileMaterialInputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileMaterialInputTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileMaterialInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
