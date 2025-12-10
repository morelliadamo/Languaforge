import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseHubComponent } from './course-hub.component';

describe('CourseHubComponent', () => {
  let component: CourseHubComponent;
  let fixture: ComponentFixture<CourseHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
