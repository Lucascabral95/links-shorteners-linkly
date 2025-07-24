import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { GetAllUsersInterface } from '../../../interfaces';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { UsersServices } from '../../../service/user.service';
import { ModalUserComponentComponent } from "../../modal-user-update/modal-user-component/modal-user-component.component";

@Component({
  selector: 'table-users-component',
  imports: [DatePipe, TitleCasePipe, ModalUserComponentComponent],
  templateUrl: './table-users-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableUsersComponentComponent {
  usersList = input<GetAllUsersInterface | null>(null);
  userService = inject(UsersServices)

  userForDeletedById = output<string>()

  showModalUpdateUser = signal<boolean>(false)
  userIdForUpdate = signal<string | null>(null)

  updateUserById(id: string,): void {
    this.userIdForUpdate.set(id)
    this.showModalUpdateUser.set(true)
  }

}
