import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMobileFilterComponent } from './base-mobile-filter.component';

describe('BaseMobileFilterComponent', () => {
    let component: BaseMobileFilterComponent;
    let fixture: ComponentFixture<BaseMobileFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BaseMobileFilterComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BaseMobileFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
