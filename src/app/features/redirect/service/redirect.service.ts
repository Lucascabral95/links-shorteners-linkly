import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ClicksService } from '../../clicks/service/clicks.service';
import { LinksService } from '../../links/service/links.service';
import { HttpClient } from '@angular/common/http';
import { GetLinkByIDInterface } from '../../links/interfaces';
import { environment } from '../../../../environments/environment.development';

const API_URL = environment.apiUrl

@Injectable({ providedIn: 'root' })
export class RedirectService {
  http = inject(HttpClient)
  router = inject(Router)
  clickService = inject(ClicksService)
  linkService = inject(LinksService)

  getRedirectByIdWithoutUserIdAndQueryParameter(url: string, short: string, uid: string | null): Observable<void> {
    window.location.href = url;

    this.clickService.createClickWithoutUserIdAndQueryParameter({
      short: short,
      uid: uid,
    }).subscribe()

    return of()
  }

  getLinkByShortCode(shortCode: string): Observable<GetLinkByIDInterface> {
    return this.http.get<GetLinkByIDInterface>(`${API_URL}/links/s/${shortCode}`)
  }
}
