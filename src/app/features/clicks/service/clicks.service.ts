import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { PaginationClickInterface } from '../interfaces/pagination-click.interface';
import { CreateClickInterface, GetClickByIDInterface, GetClicksInterface } from '../interfaces';

const API_URL = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class ClicksService {
  http = inject(HttpClient)

  clicksArray = signal<GetClicksInterface | null>(null)

  getAllClicks(params: PaginationClickInterface = {}): Observable<GetClicksInterface> {
    let httpParams = new HttpParams()

    if (params.page) {
      httpParams = httpParams.set('page', params.page)
    }

    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit)
    }

    if (params.country !== undefined && params.country !== null && params.country.trim() !== '') {
      httpParams = httpParams.set('country', params.country)
    }

    if (params.city !== undefined && params.city !== null && params.city.trim() !== '') {
      httpParams = httpParams.set('city', params.city)
    }

    if (params.device !== undefined && params.device !== null && params.device.trim() !== '') {
      httpParams = httpParams.set('device', params.device)
    }

    if (params.browser !== undefined && params.browser !== null && params.browser.trim() !== '') {
      httpParams = httpParams.set('browser', params.browser)
    }

    if (params.userId !== undefined && params.userId !== null && params.userId.trim() !== '') {
      httpParams = httpParams.set('userId', params.userId)
    }

    return this.http.get<GetClicksInterface>(`${API_URL}/clicks`, {
      params: httpParams
    }).pipe(
      tap((res: GetClicksInterface) => {
        this.clicksArray.set(res)
      })
    )

  }

  getClickById(clickId: string): Observable<GetClickByIDInterface> {
    return this.http.get<GetClickByIDInterface>(`${API_URL}/clicks/${clickId}`)
  }

  createClick({ linkId, userId }: CreateClickInterface): Observable<void> {
    return this.http.post<void>(`${API_URL}/clicks`, {
      linkId: linkId,
      userId: userId,
    })
  }
}
