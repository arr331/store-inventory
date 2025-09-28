import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidationListComponent } from './liquidation-list.component';

describe('LiquidationListComponent', () => {
  let component: LiquidationListComponent;
  let fixture: ComponentFixture<LiquidationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiquidationListComponent]
    });
    fixture = TestBed.createComponent(LiquidationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
