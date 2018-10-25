import { TestBed } from '@angular/core/testing';

import { StateDataService } from './state-data.service';

describe('StateDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateDataService = TestBed.get(StateDataService);
    expect(service).toBeTruthy();
  });
});
