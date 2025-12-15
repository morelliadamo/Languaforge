import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonHubComponent } from './lesson-hub.component';

describe('LessonHubComponent', () => {
  let component: LessonHubComponent;
  let fixture: ComponentFixture<LessonHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
