import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import FormUtils from '../../../../../shared/utils/form-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { SeoService } from '../../../../../core/services/seo.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-reset-password-change',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export default class ResetPasswordChangeComponent implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  formUtils = FormUtils;
  seoService = inject(SeoService);
  platformId = inject(PLATFORM_ID);

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showPassword = signal(false);
  token = signal<string>('');

  myForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
  }, {
    validator: this.passwordMatchValidator
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const tokenParam = params['token'];
      if (!tokenParam) {
        this.errorMessage.set('Token no válido o ausente. Por favor, utiliza el enlace de tu correo.');
        this.myForm.disable();
      }
      this.token.set(tokenParam);
    });

    if (isPlatformBrowser(this.platformId)) {
      this.seoService.setResetPasswordSEO();
    }
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      const tokenForm = this.token();
      const passwordForm = this.myForm.value.password!;

      this.authService.resetPassword({ token: tokenForm, newPassword: passwordForm }).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.successMessage.set('¡Contraseña actualizada con éxito! Redirigiendo al login...');
          this.myForm.disable();
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
          console.log('success')
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          console.log(error)
          this.errorMessage.set(error.error.message);
        }
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }

  togglePassword() {
    this.showPassword.update(show => !show);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {
      passwordMismatch: true
    };
  }
}
