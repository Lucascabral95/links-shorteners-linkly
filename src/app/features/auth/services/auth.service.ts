import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CreateAuthLoginInterface, CreateAuthRegisterInterface, CreateResetPasswordConfirmInterface, CreateResetPasswordRequestInterface, ResponseAuthLoginGoogleInterface, ResponseAuthLoginInterface, ResponseAuthRegisterInterface, ResponseGoogleAuthInterface, ResponseResetPasswordConfirmInterface, Role } from '../interfaces';
import PayloadJWTInterface from '../interfaces/payload-jwt.interface';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY_AUTH = environment.STORAGE_KEY_AUTH;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private _isInitialized = signal<boolean>(false);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    if (this.isBrowser) {
      setTimeout(() => this.checkAuthState(), 0);
    }
  }

  private checkAuthState(): void {
    if (!this.isBrowser) return;

    const token = this.getToken();
    const shouldBeAuthenticated = !!token;

    if (this.isAuthenticated() !== shouldBeAuthenticated || !this._isInitialized()) {
      this.isAuthenticated.set(shouldBeAuthenticated);
    }

    if (!this._isInitialized()) {
      this._isInitialized.set(true);
    }
  }

  login(createAuthLogin: CreateAuthLoginInterface): Observable<ResponseAuthLoginInterface> {
    return this.http.post<ResponseAuthLoginInterface>(`${environment.apiUrl}/auth/login`, {
      email: createAuthLogin.email,
      password: createAuthLogin.password
    }).pipe(
      tap((response: ResponseAuthLoginInterface) => {
        const { token } = response;
        if (this.isBrowser) {
          localStorage.setItem(STORAGE_KEY_AUTH, token);
        }
        this.isAuthenticated.set(true);
        this.router.navigate(['/dashboard/my-links']);
      }),
      catchError(error => {
        this.isAuthenticated.set(false);
        return throwError(() => error);
      })
    );
  }

  // Login wtih Google OAuth
  loginGoogle(): void {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  handleGoogleCallback(): void {
    if (!this.isBrowser) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('accessToken');

    if (token) {
      localStorage.setItem(STORAGE_KEY_AUTH, token);
      this.isAuthenticated.set(true);
      this.router.navigate(['/dashboard/my-links']);
    } else {
      this.router.navigate(['/auth/login'], {
        queryParams: {
          google: 'failed'
        }
      });
    }
  }

  register(createAuthRegister: CreateAuthRegisterInterface): Observable<ResponseAuthRegisterInterface> {
    return this.http.post<ResponseAuthRegisterInterface>(`${environment.apiUrl}/auth/register`, {
      email: createAuthRegister.email,
      password: createAuthRegister.password,
      full_name: createAuthRegister.full_name,
      role: createAuthRegister.role,
      verified: createAuthRegister.verified,
      googleId: createAuthRegister.googleId,
      picture: createAuthRegister.picture
    }).pipe(
      catchError(error => {
        console.error('Error en registro:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(STORAGE_KEY_AUTH);
  }

  getPayloadJWT(): PayloadJWTInterface | null {
    if (!this.isBrowser) return null;

    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const payloadDecoded = atob(payload);
      return JSON.parse(payloadDecoded) as PayloadJWTInterface;
    } catch (error) {
      console.error('Error decodificando JWT:', error);
      return null;
    }
  }

  getRole(): Role | null {
    if (!this.isBrowser) return null;
    const payload = this.getPayloadJWT();
    return payload?.role || null;
  }

  isAdmin(): boolean {
    if (!this.isBrowser) return false;
    const role = this.getPayloadJWT()?.role;
    return role === Role.ADMIN;
  }

  getUserId(): string | null {
    if (!this.isBrowser) return null;
    const payload = this.getPayloadJWT();
    return payload?.id || null;
  }

  forgotPassword(createResetPasswordRequest: CreateResetPasswordRequestInterface): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}/auth/forgot-password`, createResetPasswordRequest)
      .pipe(
        catchError(error => {
          console.error('Error en forgot password:', error);
          return throwError(() => error);
        })
      );
  }

  resetPassword(createResetPassworConfirm: CreateResetPasswordConfirmInterface): Observable<ResponseResetPasswordConfirmInterface> {
    return this.http.post<ResponseResetPasswordConfirmInterface>(`${environment.apiUrl}/auth/confirm-password`, {
      token: createResetPassworConfirm.token,
      newPassword: createResetPassworConfirm.newPassword
    }).pipe(
      tap((response: ResponseResetPasswordConfirmInterface) => {
        console.log('Password reset exitoso:', response);
        this.router.navigate(['/auth/login']);
      }),
      catchError(error => {
        console.error('Error en reset password:', error);
        return throwError(() => error);
      })
    );
  }
}
