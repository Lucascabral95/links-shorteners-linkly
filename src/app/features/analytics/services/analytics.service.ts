import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { GetClicksInterface } from '../../clicks/interfaces';

const API_URL = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  http = inject(HttpClient)

  clicksArray = signal<GetClicksInterface | null>(null)

  getAnalyticsById(userId: string): Observable<GetClicksInterface> {
    return this.http.get<GetClicksInterface>(`${API_URL}/clicks`, {
      params: {
        userId
      }
    }).pipe(
      tap((res: GetClicksInterface) => {
        this.clicksArray.set(res)
      })
    )
  }

}
