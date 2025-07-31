import { ChangeDetectionStrategy, Component, inject, input, signal, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LinksService } from '../../../service/links.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PasswordVerifyLinkInterface } from '../../../interfaces';
import { RedirectService } from '../../../../redirect/service/redirect.service';

@Component({
  selector: 'modal-link-password-component',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-link-password-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalLinkPasswordComponentComponent implements OnInit {
  fb = inject(FormBuilder)
  linkService = inject(LinksService)
  redirectService = inject(RedirectService)
  short = input.required<string>()
  url = input.required<string>()
  uid = input<string | null>()

  loading = signal<boolean>(false)
  errors = signal<{ message: string, code: number | null }>({ message: '', code: null })
  response = signal<string | null>(null)

  loadingSuccess = signal<boolean>(false)
  loadingError = signal<{ message: string, code: number | null }>({ message: '', code: null })
  isValidPassword = signal<boolean>(false)

  ngOnInit() {
    this.loadingSuccess.set(true)
    this.loadingError.set({ message: '', code: null })

    this.linkService.verifyPasswordOfLinkGet(this.short()).subscribe({
      next: () => {
        this.loadingSuccess.set(false)
      },
      error: (error: HttpErrorResponse) => {
        this.loadingError.set({ message: error.error.message, code: error.status })
        this.loadingSuccess.set(false)
      }
    })
  }

  myForm = this.fb.group({
    password: ['', [Validators.required]],
  })

  onSubmit() {
    if (this.myForm.valid) {
      this.loading.set(true)
      this.errors.set({ message: '', code: null })
      this.response.set(null)
      this.isValidPassword.set(false)

      const passwordData: PasswordVerifyLinkInterface = {
        password: this.myForm.value.password || ""
      };

      this.linkService.verifyPasswordOfLinkPost(this.short(), passwordData).subscribe({
        next: () => {
          this.response.set('Contraseña correcta!')
          this.isValidPassword.set(true)
          this.loading.set(false)
          this.redirectService.getRedirectByIdWithoutUserIdAndQueryParameter(this.url()!, this.short()!, this.uid() || null)
        },
        error: (error: HttpErrorResponse) => {
          this.errors.set({ message: error.error.message, code: error.status })
          this.loading.set(false)
        }
      })
    } else {
      this.myForm.markAllAsTouched()
    }
  }

  close = output<void>()

  onClose() {
    this.close.emit()
    this.response.set(null)
    this.errors.set({ message: '', code: 0 })
  }
}
