import { TestBed } from '@angular/core/testing';

import { CacheRouteService } from './cache-route.service';

describe('CacheRouteService', () => {
  let service: CacheRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
