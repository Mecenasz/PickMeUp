import { TestBed } from '@angular/core/testing';

import { PickupPubSubService } from './pickup-pub-sub.service';

describe('PickupPubSubService', () => {
  let service: PickupPubSubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PickupPubSubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
