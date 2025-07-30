import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full px-4 sm:px-6 lg:px-8 mx-auto',
    style: 'background: #0B0B27'
  }
})
export class HeaderComponent { }
