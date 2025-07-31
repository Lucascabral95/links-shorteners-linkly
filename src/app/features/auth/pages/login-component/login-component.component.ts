import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAuthLoginInterface } from '../../interfaces';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import FormUtils from '../../../../shared/utils/form-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponentComponent implements OnInit {
  authService = inject(AuthService);
  seoService = inject(SeoService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  formUtils = FormUtils;
  platformId = inject(PLATFORM_ID);

  isLoading = signal(false);
  isGoogleLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  myForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const dataAccess: CreateAuthLoginInterface = {
        email: this.myForm.value.email!,
        password: this.myForm.value.password!
      };

      this.authService.login(dataAccess).subscribe({
        next: (response) => {
          this.successMessage.set('¡Iniciando sesión!');
          this.isLoading.set(false);
          this.myForm.disable();
          this.myForm.reset();
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

  loginOfGoogle() {
    this.isGoogleLoading.set(true);
    this.authService.loginGoogle();
  }

  togglePassword() {
    this.showPassword.update(show => !show);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.seoService.setLoginSEO();
    }
  }
}
