import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { GetAnalyticsConversionRateInterface, GetAnalyticsGeographicInterface, GetAnalyticsTimeSeriesInterface, GetGeneralAnalyticsInterface, GetLinksTopInterface } from '../interfaces/admin';
import { GetQuantityResourceUserInterface } from '../../configuration/interfaces';

const API_URL = environment.apiUrl

@Injectable({ providedIn: 'root' })
export class AdminService {
  http = inject(HttpClient)

  getAllData(): Observable<GetGeneralAnalyticsInterface> {
    return this.http.get<GetGeneralAnalyticsInterface>(`${API_URL}/analytics/general`)
  }

  getLinksTop(period: string): Observable<GetLinksTopInterface> {
    return this.http.get<GetLinksTopInterface>(`${API_URL}/analytics/top-links`, {
      params: {
        page: 1,
        limit: 10000,
        period: period ?? '90d'
      }
    })
  }

  getAnalyticsGeographic(): Observable<GetAnalyticsGeographicInterface> {
    return this.http.get<GetAnalyticsGeographicInterface>(`${API_URL}/analytics/geographic`)
  }

  getConversionRate(): Observable<GetAnalyticsConversionRateInterface> {
    return this.http.get<GetAnalyticsConversionRateInterface>(`${API_URL}/analytics/conversion-rate`).pipe(
      tap((res: GetAnalyticsConversionRateInterface) => {
        console.log(res)
      })
    )
  }

  getTimeSeries(): Observable<GetAnalyticsTimeSeriesInterface> {
    return this.http.get<GetAnalyticsTimeSeriesInterface>(`${API_URL}/analytics/time-series`).pipe(
      tap((res: GetAnalyticsTimeSeriesInterface) => {
        console.log(res)
      })
    )
  }

  quantityLinks = signal<number>(0);
  quantityClicks = signal<number>(0);

  getQuantityResourceUser(userId: string): Observable<GetQuantityResourceUserInterface> {
    return this.http.get<GetQuantityResourceUserInterface>(`${API_URL}/users/quantity/resource/${userId}`).pipe(
      tap((res: GetQuantityResourceUserInterface) => {
        this.quantityLinks.set(res.quantityLinks)
        this.quantityClicks.set(res.quantityClicks)
      })
    )
  }
}
