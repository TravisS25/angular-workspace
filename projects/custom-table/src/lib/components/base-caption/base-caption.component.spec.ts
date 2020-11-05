import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCaptionComponent } from './base-caption.component';

describe('BaseCaptionComponent', () => {
  let component: BaseCaptionComponent;
  let fixture: ComponentFixture<BaseCaptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseCaptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
