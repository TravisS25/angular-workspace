import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEllipsisIconComponent } from './material-ellipsis-icon.component';

describe('MaterialEllipsisIconComponent', () => {
  let component: MaterialEllipsisIconComponent;
  let fixture: ComponentFixture<MaterialEllipsisIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialEllipsisIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialEllipsisIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
