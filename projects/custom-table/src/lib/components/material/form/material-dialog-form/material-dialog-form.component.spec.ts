import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDialogFormComponent } from './material-dialog-form.component';

describe('MaterialDialogFormComponent', () => {
  let component: MaterialDialogFormComponent;
  let fixture: ComponentFixture<MaterialDialogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialDialogFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
