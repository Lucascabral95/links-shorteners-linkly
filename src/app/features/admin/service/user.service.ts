import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { GetAllUsersInterface, GetUserByIdInterface } from '../interfaces';
import { environment } from '../../../../environments/environment.development';
import { ParamsUsersInterface } from '../interfaces/params-users.interface';
import { UpdateUsersInterface } from '../../users/interfaces';

const API_URL = environment.apiUrl

@Injectable({ providedIn: 'root' })
export class UsersServices {
  http = inject(HttpClient)
  usersList = signal<GetAllUsersInterface | null>(null)

  getAllUsers(params?: ParamsUsersInterface): Observable<GetAllUsersInterface> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<GetAllUsersInterface>(`${API_URL}/users`, {
      params: httpParams
    }).pipe(
      tap((res: GetAllUsersInterface) => {
        this.usersList.set(res)
      })
    );
  }

  getUserById(id: string): Observable<GetUserByIdInterface> {
    return this.http.get<GetUserByIdInterface>(`${API_URL}/users/${id}`)
  }

  deleteUserById(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/users/${id}`).pipe(
      tap(() => {
        this.usersList.update((prev) => {
          if (prev) {
            return {
              ...prev,
              users: prev.users.filter((user) => user.id !== id)
            }
          }
          return prev
        })
      })
    )
  }

  updateUserById(id: string, updateData: UpdateUsersInterface): Observable<void> {
    return this.http.patch<void>(`${API_URL}/users/${id}`, {
      full_name: updateData.full_name,
      role: updateData.role,
      verified: updateData.verified
    }).pipe(
      tap(() => {
        this.usersList.update((prev) => {
          if (prev) {
            return {
              ...prev,
              users: prev.users.map((user) => user.id === id ? { ...user, ...updateData } : user)
            }
          }
          return prev
        })
      })
    )
  }

}
