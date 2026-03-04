import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForFriends } from './search-for-friends';

describe('SearchForFriends', () => {
  let component: SearchForFriends;
  let fixture: ComponentFixture<SearchForFriends>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchForFriends]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchForFriends);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
