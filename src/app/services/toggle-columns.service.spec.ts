import { TestBed } from '@angular/core/testing';

import { ToggleColumnsService } from './toggle-columns.service';

describe('ToggleColumnsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToggleColumnsService = TestBed.get(ToggleColumnsService);
    expect(service).toBeTruthy();
  });
});
