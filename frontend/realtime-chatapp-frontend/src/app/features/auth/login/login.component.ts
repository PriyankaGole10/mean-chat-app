import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule,MatCardModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private authSer = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);

  hidePassword = true;


  loginForm!: FormGroup;

  ngOnInit() {
    this.initialiazeForm();
  }

  initialiazeForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20),
       
      ]]
    })
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.authSer.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.authSer.saveToken(res.token);
        sessionStorage.setItem('user',JSON.stringify(res.user))
        this.snackbar.open('Login Success', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
        this.router.navigate(['/chat'])
      },
      error: (err: any) => {
        console.error(err.error.message)
      },
    }
    )
  }


  passwordValidator(): ValidatorFn {

    return (
      control: AbstractControl
    ): ValidationErrors | null => {
      const value = control.value;

      if (!value) { return null }
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);

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



  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

}



