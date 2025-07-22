import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JiraRedirectComponent } from './jira-redirect.component';

describe('JiraRedirectComponent', () => {
  let component: JiraRedirectComponent;
  let fixture: ComponentFixture<JiraRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JiraRedirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JiraRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
