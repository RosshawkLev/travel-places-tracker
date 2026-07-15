import { TestBed } from '@angular/core/testing';

import { PlacesApi } from './places-api.service';

describe('PlacesApi', () => {
  let service: PlacesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
