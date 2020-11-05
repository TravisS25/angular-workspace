import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCheckboxComponent } from './header-checkbox.component';

describe('HeaderCheckboxComponent', () => {
  let component: HeaderCheckboxComponent;
  let fixture: ComponentFixture<HeaderCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
