import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialExpandRowComponent } from './material-expand-row.component';

describe('MaterialExpandRowComponent', () => {
  let component: MaterialExpandRowComponent;
  let fixture: ComponentFixture<MaterialExpandRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialExpandRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialExpandRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
