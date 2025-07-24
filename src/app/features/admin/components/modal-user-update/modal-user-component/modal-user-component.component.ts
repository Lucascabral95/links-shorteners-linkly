import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UsersServices } from '../../../service/user.service';
import FormUtils from '../../../../../shared/utils/form-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { GetUserByIdInterface } from '../../../interfaces';
import { UpdateUsersInterface } from '../../../../users/interfaces';
import { environment } from '../../../../../../environments/environment.development';

const TIMEOUT = environment.TOAST_TIME

@Component({
  selector: 'modal-user-component',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-user-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalUserComponentComponent {
  usersService = inject(UsersServices)
  formUtils = FormUtils
  fb = inject(FormBuilder)

  title = signal<string>('Actualizar usuario')
  isLoading = signal<boolean>(false)
  error = signal<{ message: string | null, code: number } | null>(null)
  messageSuccess = signal<string | null>(null)
  messageError = signal<string | null>(null)

  onClose = output<void>()

  userIdForUpdate = input<string | null>(null)

  myForm = this.fb.group({
    full_name: [''],
    role: [''],
    verified: [false],
  })

  ngOnInit() {
    this.usersService.getUserById(this.userIdForUpdate()!).subscribe({
      next: (response: GetUserByIdInterface) => {
        this.myForm.patchValue({
          full_name: response?.full_name || '',
          role: response?.role || '',
          verified: response?.verified ? true : false,
        })
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.status)
      }
    })
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.isLoading.set(true)
      const dataUpdatedUser = {
        full_name: this.myForm.value.full_name,
        role: this.myForm.value.role,
        verified: this.myForm.value.verified
      } as UpdateUsersInterface

      this.usersService.updateUserById(this.userIdForUpdate()!, dataUpdatedUser).subscribe({
        next: () => {
          this.isLoading.set(false)
          this.messageSuccess.set('Usuario actualizado correctamente')
          setTimeout(() => {
            this.onClose.emit()
          }, TIMEOUT)
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false)
          this.messageError.set(error.message)
        }
      })

    } else {
      this.myForm.markAllAsTouched()
    }
  }
}
