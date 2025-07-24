import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type SuccessOrError = 'success' | 'error'

@Component({
  selector: 'toast-component',
  imports: [],
  templateUrl: './toast-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponentComponent {
  message = input<string | null>('Internal server error')
  successOrError = input<SuccessOrError>('error')
}
