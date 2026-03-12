import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDataManagement } from './admin-data-management';

describe('AdminDataManagement', () => {
  let component: AdminDataManagement;
  let fixture: ComponentFixture<AdminDataManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDataManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDataManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
