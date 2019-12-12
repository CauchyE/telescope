import { TestBed } from '@angular/core/testing';

import { DesignationService } from './designation.service';

describe('DesignationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DesignationService = TestBed.get(DesignationService);
    expect(service).toBeTruthy();
  });
});
