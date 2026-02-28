import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreakChanged } from './streak-changed';

describe('StreakChanged', () => {
  let component: StreakChanged;
  let fixture: ComponentFixture<StreakChanged>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreakChanged]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreakChanged);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
