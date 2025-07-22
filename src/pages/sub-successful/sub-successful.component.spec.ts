import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSuccessfulComponent } from './sub-successful.component';

describe('SubSuccessfulComponent', () => {
  let component: SubSuccessfulComponent;
  let fixture: ComponentFixture<SubSuccessfulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubSuccessfulComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
