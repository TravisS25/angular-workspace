import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextOutputTemplateComponent } from './text-output-template.component';

describe('TextOutputTemplateComponent', () => {
  let component: TextOutputTemplateComponent;
  let fixture: ComponentFixture<TextOutputTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextOutputTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextOutputTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
