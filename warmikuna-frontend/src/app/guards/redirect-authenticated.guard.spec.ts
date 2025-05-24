import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redirectAuthenticatedGuard } from './redirect-authenticated.guard';

describe('redirectAuthenticatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redirectAuthenticatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
