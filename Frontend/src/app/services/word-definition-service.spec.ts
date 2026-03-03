import { TestBed } from '@angular/core/testing';

import { WordDefinitionService } from './word-definition-service';

describe('WordDefinitionService', () => {
  let service: WordDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordDefinitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
