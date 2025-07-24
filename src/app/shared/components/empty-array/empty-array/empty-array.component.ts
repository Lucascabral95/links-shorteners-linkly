import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'empty-array-component',
  imports: [],
  templateUrl: './empty-array.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyArrayComponent {
  message = input<string>('Vacío')
  description = input<string>('Empezá a llenar datos.')
}
