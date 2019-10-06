import { TestBed } from '@angular/core/testing';

import { SingleQueryService } from './single-query.service';

describe('SingleQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SingleQueryService = TestBed.get(SingleQueryService);
    expect(service).toBeTruthy();
  });
});
