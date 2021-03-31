import { TestBed } from '@angular/core/testing';

import { SimulateBackendService } from './simulate-backend.service';

describe('SimulateBackendService', () => {
  let service: SimulateBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulateBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
