import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'modal-crud',
  imports: [],
  templateUrl: './modal-crud.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ModalCrudComponent {
  title = input.required<string>();

  onClose = output<void>();
}
