import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengTableExpansionComponent } from './primeng-table-expansion.component';

describe('PrimengTableExpansionComponent', () => {
  let component: PrimengTableExpansionComponent;
  let fixture: ComponentFixture<PrimengTableExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimengTableExpansionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimengTableExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
