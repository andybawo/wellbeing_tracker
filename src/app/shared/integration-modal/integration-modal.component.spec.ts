import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationModalComponent } from './integration-modal.component';

describe('IntegrationModalComponent', () => {
  let component: IntegrationModalComponent;
  let fixture: ComponentFixture<IntegrationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegrationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
