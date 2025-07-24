import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Click } from '../../../interfaces/get-clicks.interface';
import { ToastComponentComponent } from '../../../../../shared/components/toast/toast-component/toast-component.component';

@Component({
  selector: 'card-click-component',
  imports: [DatePipe, ToastComponentComponent],
  templateUrl: './card-click-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardClickComponentComponent {
  click = input.required<Click>()

  shortCodeCopied = signal(false)
  messageCopied = signal('')

  copyShortCode(shortCode: string) {
    navigator.clipboard.writeText(shortCode)
    this.shortCodeCopied.set(true)
    this.messageCopied.set('Código corto copiado')
    setTimeout(() => {
      this.shortCodeCopied.set(false)
      this.messageCopied.set('')
    }, 2000)
  }

  copyOriginalUrl(originalUrl: string) {
    navigator.clipboard.writeText(originalUrl)
    this.shortCodeCopied.set(true)
    this.messageCopied.set('URL original copiada')
    setTimeout(() => {
      this.shortCodeCopied.set(false)
      this.messageCopied.set('')
    }, 2000)
  }
}
