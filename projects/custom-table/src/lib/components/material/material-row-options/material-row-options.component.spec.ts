import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRowOptionsComponent } from './material-row-options.component';

describe('MaterialRowOptionsComponent', () => {
  let component: MaterialRowOptionsComponent;
  let fixture: ComponentFixture<MaterialRowOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialRowOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRowOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
