import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadedCourseComponent } from './loaded-course.component';

describe('LoadedCourseComponent', () => {
  let component: LoadedCourseComponent;
  let fixture: ComponentFixture<LoadedCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadedCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
