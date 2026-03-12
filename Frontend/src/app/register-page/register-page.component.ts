import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RegisterServiceService } from '../services/register-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-register-page',
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    LoadingOverlayComponent,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  registerForm: FormGroup;

  registerService = inject(RegisterServiceService);

  isLoading: boolean = false;

  serverError: string = '';
  emailTakenError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  //   register() {
  //     if (this.registerForm.valid) {
  //       const formValue = this.registerForm.value;

  //       this.isLoading = true;

  //       const userData = {
  //         username: formValue.username,
  //         email: formValue.email,
  //         passwordHash: formValue.password,
  //       };

  //       this.registerService.register(userData).subscribe({
  //         next: (response) => {
  //           console.log('Registration successful!', response);
  //           this.isLoading = false;
  //           this.router.navigate(['register/success'], {
  //             state: { email: formValue.email, fromRegistration: true },
  //           });
  //         },
  //         error: (err: HttpErrorResponse) => {
  //           this.isLoading = false;

  //           if (err.status === 409) {
  //             const backendMsg =
  //               err.error?.error ||
  //               err.error?.message ||
  //               'This email address is already in use.';

  //             this.registerForm.get('email')?.setErrors({ emailTaken: true });
  //           } else {
  //             this.serverError = 'Registration failed. Please try again later.';
  //             console.error(err);
  //           }
  //         },
  //       });
  //     }
  //   }
  register() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.emailTakenError = null;
      this.serverError = '';

      const formValue = this.registerForm.value;

      const userData = {
        username: formValue.username,
        email: formValue.email,
        passwordHash: formValue.password,
      };

      this.registerService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful!', response.id);
          this.isLoading = false;
          this.router.navigate(['register/success'], {
            state: { email: formValue.email, fromRegistration: true },
          });
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;

          if (err.status === 409) {
            const msg =
              err.error?.error ||
              err.error?.message ||
              err.error?.detail ||
              'Ez az email cím már foglalt. Kérlek válassz másikat.';

            this.emailTakenError = msg;
            this.registerForm.get('email')?.markAsTouched();
          } else {
            this.serverError =
              'A regisztráció sikertelen. Kérlek próbáld újra később.';
            console.error('Registration error', err);
          }
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
