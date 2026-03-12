import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserSettings } from './admin-user-settings';

describe('AdminUserSettings', () => {
  let component: AdminUserSettings;
  let fixture: ComponentFixture<AdminUserSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
