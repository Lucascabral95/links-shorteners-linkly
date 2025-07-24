import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';
import { AuthService } from '../../../auth/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastComponentComponent } from "../../../../shared/components/toast/toast-component/toast-component.component";
import { DatePipe } from '@angular/common';
import { GetUsersInterface } from '../../interfaces/get-user.interface';
import { LoadingComponentComponent } from "../../../../shared/components/loading/loading-component/loading-component.component";
import { ErrorRequestsComponent } from "../../../../shared/components/errors/error-requests/error-requests.component";

@Component({
  selector: 'app-configuration',
  imports: [ReactiveFormsModule, ToastComponentComponent, DatePipe, LoadingComponentComponent, ErrorRequestsComponent],
  templateUrl: './configuration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ConfigurationComponent {
  configurationService = inject(ConfigurationService)
  authService = inject(AuthService)
  loading = signal<boolean>(false)
  errors = signal<{ message: string | null, status: number | null }>({ message: null, status: null })
  fb = inject(FormBuilder)
  userId = signal<string | null>(this.authService.getUserId())

  userData = signal<GetUsersInterface | null>(null)

  loadingUpdate = signal<boolean>(false)
  errorUpdate = signal<string | null>(null)
  successUpdate = signal<string | null>(null)

  myForm: FormGroup = this.fb.group({
    full_name: [this.userData()?.full_name || '', [Validators.required]],
  })

  ngOnInit() {
    this.loading.set(true)
    this.errors.set({ message: null, status: null })

    this.configurationService.getUserById(this.userId()).subscribe({
      next: (user) => {
        this.loading.set(false)
        this.userData.set(user)
        this.myForm.patchValue({
          full_name: this.userData()?.full_name || ''
        })
        console.log(user)
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false)
        this.errors.set({ message: error.message, status: error.status })
        console.log(error)
      }
    })
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.loadingUpdate.set(true)
      this.errorUpdate.set(null)
      this.successUpdate.set(null)

      const full_name = this.myForm.value.full_name

      this.configurationService.updateUser(this.userId()!, {
        full_name: full_name
      }).subscribe({
        next: (user) => {
          this.loadingUpdate.set(false)
          this.successUpdate.set('Usuario actualizado correctamente')
          console.log(`Salio todo bien`)
          setTimeout(() => {
            this.successUpdate.set(null)
          }, 2500);
        },
        error: (error: HttpErrorResponse) => {
          this.loadingUpdate.set(false)
          this.errorUpdate.set(error.message)
          setTimeout(() => {
            this.errorUpdate.set(null)
          }, 2500);
        }
      })

    } else {

      this.myForm.markAllAsTouched()
    }
  }

}
