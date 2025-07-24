import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'error-requests',
  imports: [RouterLink],
  templateUrl: './error-requests.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorRequestsComponent {
  messageError = input<string>("Internal Server Error")
  codeError = input<number>(500)
}
