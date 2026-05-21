import {
  Component,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterModule
} from '@angular/router';

import { AuthService }
  from '../../../core/services/auth.service';

// MATERIAL

import { MatCardModule }
  from '@angular/material/card';

import { MatInputModule }
  from '@angular/material/input';

import { MatButtonModule }
  from '@angular/material/button';

import { MatFormFieldModule }
  from '@angular/material/form-field';

import { MatIconModule }
  from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule
  ],

  templateUrl:
    './register.component.html',

  styleUrl:
    './register.component.scss'
})

export class RegisterComponent {

  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private router = inject(Router);
  private snackbar = inject(MatSnackBar);
  hidePassword = true;

  registerForm: FormGroup = this.fb.group({

    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
      // this.passwordValidator()
    ],
  });

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService
      .register(this.registerForm.value)
      .subscribe({
        next: () => {

          this.snackbar.open('Registration Success', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          })

          this.router.navigate([
            '/login'
          ]);
        },

        error: (err) => {
          alert(
            err.error.message
          );
        }
      });
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase =
        /[A-Z]/.test(value);

      const hasLowerCase =
        /[a-z]/.test(value);

      const hasNumber =
        /[0-9]/.test(value);

      const hasSpecialCharacter =
        /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const validPassword =

        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialCharacter;

      return !validPassword
        ? {
          weakPassword: true
        }
        : null;
    };
  }

  get username() {
    return this.registerForm.get(
      'username'
    );
  }

  get email() {
    return this.registerForm.get(
      'email'
    );
  }

  get password() {
    return this.registerForm.get(
      'password'
    );
  }

   togglePassword() {
    this.hidePassword = !this.hidePassword;
  }
}