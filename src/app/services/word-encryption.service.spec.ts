import { TestBed } from '@angular/core/testing';

import { WordEncryptionService } from './word-encryption.service';

describe('WordEncryptionService', () => {
  let service: WordEncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordEncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
