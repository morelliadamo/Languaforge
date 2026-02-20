import { TestBed } from '@angular/core/testing';

import { LessonProgressService } from './lesson-progress.service';

describe('LessonProgressService', () => {
  let service: LessonProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
