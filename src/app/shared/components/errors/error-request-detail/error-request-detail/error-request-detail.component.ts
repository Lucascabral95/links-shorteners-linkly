import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'error-request-detail',
  imports: [],
  templateUrl: './error-request-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorRequestDetailComponent {
  detailError = input<{ message: string | null, code: number }>({ message: 'Internal Server Error', code: 500 })
}
