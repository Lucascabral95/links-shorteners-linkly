import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GetUsersInterface } from '../interfaces/get-user.interface';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { UpdateOnlyUserInterface } from '../interfaces/update-only-user.interface';

const API_URL = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  http = inject(HttpClient)

  getUserById(id: string | null): Observable<GetUsersInterface> {
    return this.http.get<GetUsersInterface>(`${API_URL}/users/${id}`)
  }

  getAllUsers(): Observable<GetUsersInterface[]> {
    return this.http.get<GetUsersInterface[]>(`${API_URL}/users`)
  }

  updateUser(id: string, updateUser: UpdateOnlyUserInterface): Observable<GetUsersInterface> {
    return this.http.patch<GetUsersInterface>(`${API_URL}/users/${id}`, updateUser).pipe(
      tap((res: GetUsersInterface) => {
        console.log(res)
      })
    )
  }
}
