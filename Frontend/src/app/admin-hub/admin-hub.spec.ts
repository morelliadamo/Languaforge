import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHub } from './admin-hub';

describe('AdminHub', () => {
  let component: AdminHub;
  let fixture: ComponentFixture<AdminHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
