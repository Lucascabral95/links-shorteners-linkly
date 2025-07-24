import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import FormUtils from '../../../../../shared/utils/form-utils';
import { LinksService } from '../../../../links/service/links.service';
import { GetLinkByIDInterface } from '../../../../links/interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment.development';

const TIMEOUT = environment.TOAST_TIME

@Component({
  selector: 'update-link-modal-component',
  imports: [ReactiveFormsModule],
  templateUrl: './update-link-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateClickModalComponent {
  linkService = inject(LinksService)
  fb = inject(FormBuilder)
  formUtils = FormUtils;
  onClose = output<void>();
  linkId = input<string | null>()
  linkByIdData = signal<GetLinkByIDInterface | null>(null)

  isLoading = signal<boolean>(false)
  messageSuccess = signal<string>('')
  messageError = signal<string>('')

  ngOnInit() {
    this.linkService.getLinkById(this.linkId()!).subscribe((response) => {
      this.linkByIdData.set(response)
      this.myForm.patchValue({
        originalUrl: response.originalUrl || '',
        shortCode: response.shortCode || '',
        customAlias: response.customAlias || '',
        title: response.title || '',
        description: response.description || '',
        password: response.password || '',
        expiresAt: response.expiresAt ? new Date(response.expiresAt) : null,
        isActive: response.isActive,
        isPublic: response.isPublic,
        category: response.category || '',
      })
    })
  }

  myForm = this.fb.group({
    originalUrl: [this.linkByIdData()?.originalUrl],
    shortCode: [this.linkByIdData()?.shortCode],
    customAlias: [this.linkByIdData()?.customAlias],
    title: [this.linkByIdData()?.title],
    description: [this.linkByIdData()?.description],
    password: [this.linkByIdData()?.password],
    expiresAt: [this.linkByIdData()?.expiresAt],
    isActive: [this.linkByIdData()?.isActive],
    isPublic: [this.linkByIdData()?.isPublic],
    category: [this.linkByIdData()?.category],
  })

  onSubmit() {
    if (this.myForm.valid) {
      const changedData: any = {};

      Object.keys(this.myForm.controls).forEach(key => {
        const control = this.myForm.get(key);
        if (control?.dirty) {
          if (key === 'isActive' || key === 'isPublic') {
            changedData[key] = control.value === 'true' ? true : false;
          } else if (key === 'expiresAt') {
            changedData[key] = control.value ? new Date(control.value) : null;
          } else {
            changedData[key] = control.value;
          }
        }
      });

      if (Object.keys(changedData).length === 0) {
        this.messageError.set('No hay cambios para guardar');
        return;
      }

      this.isLoading.set(true);
      this.linkService.updateLink(this.linkId()!, changedData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.messageSuccess.set(response.message);
          setTimeout(() => {
            this.onClose.emit()
            this.myForm.reset()
          }, TIMEOUT)
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.messageError.set(error.error.message);
        }
      });
    } else {
      this.myForm.markAllAsTouched();
    }
  }

}
