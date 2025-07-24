import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { CreateLinkInterface, GetLinkByIDInterface, GetLinksInterface, Link, ParamsLinkInterface, ResponseCreateLinkInterface, UpdateLinkInterface } from '../interfaces';
import { ResponseUpdateLinkInterface } from '../interfaces/response-update-link.interface';
import { Role } from '../../auth/interfaces';
import { GetStatsLinkByIDInterface } from '../interfaces/get-stats-link-by-id.interface';

const API_URL = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  http = inject(HttpClient)

  linksArray = signal<GetLinksInterface | null>(null)

  getAllLinks(params: ParamsLinkInterface = {}): Observable<GetLinksInterface> {

    let httpParams = new HttpParams()

    if (params.page) {
      httpParams = httpParams.set('page', params.page)
    }

    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit)
    }

    if (params.isActive !== undefined) {
      httpParams = httpParams.set('isActive', params.isActive)
    }

    if (params.isPublic !== undefined) {
      httpParams = httpParams.set('isPublic', params.isPublic)
    }

    if (params.category !== undefined && params.category !== null && params.category.trim() !== '') {
      httpParams = httpParams.set('category', params.category.trim())
    }

    if (params.customAlias !== undefined && params.customAlias !== null && params.customAlias.trim() !== '') {
      httpParams = httpParams.set('customAlias', params.customAlias.trim())
    }

    if (params.search !== undefined && params.search !== null && params.search.trim() !== '') {
      httpParams = httpParams.set('search', params.search.trim())
    }

    if (params.title !== undefined && params.title !== null && params.title.trim() !== '') {
      httpParams = httpParams.set('title', params.title.trim())
    }

    if (params.userId !== undefined && params.userId !== null && params.userId.trim() !== '') {
      httpParams = httpParams.set('userId', params.userId.trim())
    }

    return this.http.get<GetLinksInterface>(`${API_URL}/links`, {
      params: httpParams
    })
      .pipe(tap(response => {
        this.linksArray.set(response)
      }));
  }

  getLinkById(linkId: string): Observable<GetLinkByIDInterface> {
    return this.http.get<GetLinkByIDInterface>(`${API_URL}/links/${linkId}`)
  }

  createLink(createLinkInterface: CreateLinkInterface): Observable<ResponseCreateLinkInterface> {
    return this.http.post<ResponseCreateLinkInterface>(`${API_URL}/links`, {
      userId: createLinkInterface.userId,
      originalUrl: createLinkInterface.originalUrl,
      shortCode: createLinkInterface.shortCode,
      customAlias: createLinkInterface.customAlias,
      title: createLinkInterface.title,
      description: createLinkInterface.description,
      password: createLinkInterface.password,
      expiresAt: createLinkInterface.expiresAt,
      isActive: createLinkInterface.isActive,
      isPublic: createLinkInterface.isPublic,
      category: createLinkInterface.category
    }).pipe(
      tap((response) => {
        const newLink: Link = {
          ...response.linkCreated,
          clicks: [],
          user: {
            id: createLinkInterface.userId,
            full_name: 'Usuario Actual',
            email: '',
            role: Role.FREE,
            verified: true,
            created_at: new Date(),
            updated_at: new Date(),
            provider: 'local'
          }
        };

        this.linksArray.update((prev: GetLinksInterface | null) => {
          if (!prev) {
            return {
              links: [newLink],
              quantityLinks: 1,
              totalPages: 1,
              currentPage: 1,
              hasNextPage: false,
              hasPreviousPage: false
            };
          }

          const newLinks = [newLink, ...prev.links];

          return {
            ...prev,
            links: newLinks,
            quantityLinks: newLinks.length
          };
        });
      })
    )
  }

  updateLink(linkId: string, updateLinkInterface: UpdateLinkInterface): Observable<ResponseUpdateLinkInterface> {
    return this.http.patch<ResponseUpdateLinkInterface>(`${API_URL}/links/${linkId}`, {
      userId: updateLinkInterface.userId,
      originalUrl: updateLinkInterface.originalUrl,
      shortCode: updateLinkInterface.shortCode,
      customAlias: updateLinkInterface.customAlias,
      title: updateLinkInterface.title,
      description: updateLinkInterface.description,
      password: updateLinkInterface.password,
      expiresAt: updateLinkInterface.expiresAt,
      isActive: updateLinkInterface.isActive,
      isPublic: updateLinkInterface.isPublic,
      category: updateLinkInterface.category
    }).pipe(
      tap((response) => {
        this.linksArray.update((prev: GetLinksInterface | null) => {
          if (!prev) {
            return {
              links: [],
              quantityLinks: 0,
              totalPages: 1,
              currentPage: 1,
              hasNextPage: false,
              hasPreviousPage: false
            };
          }

          const newLinks = prev.links.map(link => {
            if (link.id === linkId) {
              return {
                ...link,
                ...response.linkUpdated
              };
            }
            return link;
          });

          return {
            ...prev,
            links: newLinks
          };
        });
      })
    )
  }

  deleteLink(linkId: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/links/${linkId}`).pipe(
      tap(() => {
        this.linksArray.update((prev: GetLinksInterface | null) => {
          if (!prev) {
            return {
              links: [],
              quantityLinks: 0,
              totalPages: 1,
              currentPage: 1,
              hasNextPage: false,
              hasPreviousPage: false
            };
          }

          const newLinks = prev.links.filter(link => link.id !== linkId);

          return {
            ...prev,
            links: newLinks,
            quantityLinks: newLinks.length
          };
        });
      })
    )
  }

  getStatsOfLink(linkId: string): Observable<GetStatsLinkByIDInterface> {
    return this.http.get<GetStatsLinkByIDInterface>(`${API_URL}/links/stats/${linkId}`)
  }
}
