import { TestBed } from '@angular/core/testing';

import { GooglePlacesService } from './google-places.service';

describe('GooglePlacesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GooglePlacesService = TestBed.get(GooglePlacesService);
    expect(service).toBeTruthy();
  });
});
