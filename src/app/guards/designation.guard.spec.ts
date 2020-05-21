import { TestBed, async, inject } from '@angular/core/testing';

import { DesignationGuard } from './designation.guard';

describe('DesignationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DesignationGuard]
    });
  });

  it('should ...', inject([DesignationGuard], (guard: DesignationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
