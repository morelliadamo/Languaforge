import { TestBed } from '@angular/core/testing';

import { CourseLoaderServiceService } from './course-loader-service.service';

describe('CourseLoaderServiceService', () => {
  let service: CourseLoaderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseLoaderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
