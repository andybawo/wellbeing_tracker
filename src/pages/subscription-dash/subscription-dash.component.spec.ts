import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionDashComponent } from './subscription-dash.component';

describe('SubscriptionDashComponent', () => {
  let component: SubscriptionDashComponent;
  let fixture: ComponentFixture<SubscriptionDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
