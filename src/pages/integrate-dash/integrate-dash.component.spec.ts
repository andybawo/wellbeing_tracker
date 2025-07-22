import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrateDashComponent } from './integrate-dash.component';

describe('IntegrateDashComponent', () => {
  let component: IntegrateDashComponent;
  let fixture: ComponentFixture<IntegrateDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrateDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegrateDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
