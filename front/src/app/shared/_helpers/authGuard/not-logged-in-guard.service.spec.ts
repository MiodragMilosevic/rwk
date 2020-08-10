import { TestBed } from '@angular/core/testing';

import { NotLoggedInGuardService } from './not-logged-in-guard.service';

describe('NotLoggedInGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotLoggedInGuardService = TestBed.get(NotLoggedInGuardService);
    expect(service).toBeTruthy();
  });
});
