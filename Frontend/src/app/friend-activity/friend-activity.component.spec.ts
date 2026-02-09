import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendActivityComponent } from './friend-activity.component';

describe('FriendActivityComponent', () => {
  let component: FriendActivityComponent;
  let fixture: ComponentFixture<FriendActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendActivityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
