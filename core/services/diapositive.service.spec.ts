import { TestBed } from '@angular/core/testing';

import { DiapositiveService } from './diapositive.service';

describe('DiapositiveService', () => {
  let service: DiapositiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiapositiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
