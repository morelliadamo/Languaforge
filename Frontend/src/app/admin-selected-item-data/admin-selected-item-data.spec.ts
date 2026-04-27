import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSelectedItemData } from './admin-selected-item-data';

describe('AdminSelectedItemData', () => {
  let component: AdminSelectedItemData;
  let fixture: ComponentFixture<AdminSelectedItemData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSelectedItemData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSelectedItemData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
