import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAuthRegisterInterface } from '../../interfaces';
import { CommonModule } from '@angular/common';
import FormUtils from '../../../../shared/utils/form-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponentComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  formUtils = FormUtils;
  router = inject(Router);

  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);

  myForm = this.fb.group({
    full_name: ['', [Validators.required, Validators.pattern(/^(.*\S).+\S$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  successMessage = signal<string | null>(null);

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const dataAccess: CreateAuthRegisterInterface = {
        full_name: this.myForm.value.full_name!,
        email: this.myForm.value.email!,
        password: this.myForm.value.password!,
      };

      this.authService.register(dataAccess).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.successMessage.set('¡Usuario registrado con éxito! Redirigiendo al login...');
          this.myForm.disable();
          this.myForm.reset();
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(error.error.message);
          this.isLoading.set(false);
        }
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  togglePassword() {
    this.showPassword.update(show => !show);
  }
}
