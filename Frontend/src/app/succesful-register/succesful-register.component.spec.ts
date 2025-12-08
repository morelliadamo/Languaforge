import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesfulRegisterComponent } from './succesful-register.component';

describe('SuccesfulRegisterComponent', () => {
  let component: SuccesfulRegisterComponent;
  let fixture: ComponentFixture<SuccesfulRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccesfulRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccesfulRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
