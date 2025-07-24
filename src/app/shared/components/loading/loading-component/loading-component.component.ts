import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'loading-component',
  imports: [],
  templateUrl: './loading-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponentComponent { }
