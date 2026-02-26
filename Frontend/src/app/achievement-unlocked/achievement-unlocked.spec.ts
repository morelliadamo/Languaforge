import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementUnlocked } from './achievement-unlocked';

describe('AchievementUnlocked', () => {
  let component: AchievementUnlocked;
  let fixture: ComponentFixture<AchievementUnlocked>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementUnlocked]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementUnlocked);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
