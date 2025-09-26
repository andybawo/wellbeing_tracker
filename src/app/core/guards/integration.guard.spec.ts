import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { integrationGuard } from './integration.guard';

describe('integrationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => integrationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
