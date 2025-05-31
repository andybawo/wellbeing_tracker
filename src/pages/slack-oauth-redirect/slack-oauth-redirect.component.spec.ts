import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlackOauthRedirectComponent } from './slack-oauth-redirect.component';

describe('SlackOauthRedirectComponent', () => {
  let component: SlackOauthRedirectComponent;
  let fixture: ComponentFixture<SlackOauthRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlackOauthRedirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlackOauthRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
