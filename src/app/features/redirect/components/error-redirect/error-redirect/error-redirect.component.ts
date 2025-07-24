import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'error-redirect',
  imports: [],
  templateUrl: './error-redirect.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorRedirectComponent {
  errors = input<{ message: string, code: number }>({ message: 'Internal Server Error', code: 500 })
}
