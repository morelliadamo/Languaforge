import { TestBed } from '@angular/core/testing';

import { CourseLogicService } from './course-logic.service';

describe('CourseLogicService', () => {
  let service: CourseLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
