import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import FormUtils from '../../../../../shared/utils/form-utils';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export default class ForgotPasswordComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  formUtils = FormUtils;

  isLoading = signal(false);
  errorMessage = signal('');
  message = signal('');

  myForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.message.set('');

      const emailForm = this.myForm.value.email!;

      this.authService.forgotPassword({ email: emailForm }).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.message.set('¡Revisá tu correo! Te enviamos un enlace para restablecer tu contraseña.');
          this.myForm.disable();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error.message);
        }
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }
}
