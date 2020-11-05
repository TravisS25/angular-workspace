import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowOptionsComponent } from './row-options.component';

describe('RowOptionsComponent', () => {
  let component: RowOptionsComponent;
  let fixture: ComponentFixture<RowOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
