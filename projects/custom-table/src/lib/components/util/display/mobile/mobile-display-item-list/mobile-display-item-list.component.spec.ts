import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDisplayItemListComponent } from './mobile-display-item-list.component';

describe('MobileDisplayItemListComponent', () => {
  let component: MobileDisplayItemListComponent;
  let fixture: ComponentFixture<MobileDisplayItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileDisplayItemListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDisplayItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
