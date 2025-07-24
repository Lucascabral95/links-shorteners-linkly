import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LinksService } from '../../../../links/service/links.service';
import { CreateLinkInterface } from '../../../../links/interfaces';
import FormUtils from '../../../../../shared/utils/form-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment.development';
import { AuthService } from '../../../../auth/services/auth.service';

const timeSuccessModal = environment.timeSuccessModal

@Component({
  selector: 'create-link-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './create-link-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLinkModalComponent {
  title = input.required<string>()
  onClose = output<void>();
  linkService = inject(LinksService)
  authService = inject(AuthService)
  fb = inject(FormBuilder)
  formUtils = FormUtils
  isLoading = signal<boolean>(false)
  messageSuccess = signal<string>('')
  messageError = signal<string>('')

  isGeneratingShortCode = signal<boolean>(false)

  myForm = this.fb.group({
    originalUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    shortCode: ['', [Validators.required]],
    customAlias: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]+$')]],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    password: [''],
    expiresAt: [''],
    isActive: ['true'],
    isPublic: ['true'],
    category: [''],
  })

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading.set(true)

      const link: CreateLinkInterface = {
        userId: this.authService.getUserId() || '',
        originalUrl: this.myForm.value.originalUrl || '',
        shortCode: this.myForm.value.shortCode || '',
        customAlias: this.myForm.value.customAlias || '',
        title: this.myForm.value.title || '',
        description: this.myForm.value.description || '',
        password: this.myForm.value.password || '',
        expiresAt: this.myForm.value.expiresAt ? new Date() : undefined,
        isActive: this.myForm.value.isActive === 'true' ? true : false,
        isPublic: this.myForm.value.isPublic === 'true' ? true : false,
        category: this.myForm.value.category || '',
      }

      this.isLoading.set(true)
      this.linkService.createLink(link).subscribe({
        next: (response) => {
          this.isLoading.set(false)
          this.messageError.set('')
          this.messageSuccess.set('Enlace creado correctamente')
          setTimeout(() => {
            this.onClose.emit()
          }, timeSuccessModal);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false)
          console.log(error)
          this.messageError.set(`Error al crear el enlace: ${error.error.message}`)
        }
      })
    } else {
      this.isLoading.set(false)
      this.myForm.markAllAsTouched()
    }
  }
}
