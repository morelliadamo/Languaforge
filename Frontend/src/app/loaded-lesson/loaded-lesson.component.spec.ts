import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadedLessonComponent } from './loaded-lesson.component';

describe('LoadedLessonComponent', () => {
  let component: LoadedLessonComponent;
  let fixture: ComponentFixture<LoadedLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadedLessonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadedLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
