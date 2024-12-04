import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export enum DashboardServiceType {
  USER_LOGIN,
  USER_LOGOUT,
  USER_REGISTER
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private BASE_URL_API = 'https://lib.horuzt.com/api';

  constructor(private httpSvc: HttpClient) { }

  private getUrl(serviceType: DashboardServiceType): string {
    switch (serviceType) {

      case DashboardServiceType.USER_LOGIN:
        return `${this.BASE_URL_API}/v1/login`;

      case DashboardServiceType.USER_LOGOUT:
        return `${this.BASE_URL_API}/v1/logout`;

      case DashboardServiceType.USER_REGISTER:
        return `${this.BASE_URL_API}/v1/register`;
      default:
        return '';
    }
  }

  create(serviceType: DashboardServiceType, body: any): Observable<any> {
    return this.httpSvc.post(this.getUrl(serviceType), body);
  }

  createParam(serviceType: DashboardServiceType, body: any, param: string = ''): Observable<any> {
    return this.httpSvc.post(`${this.getUrl(serviceType)}${param}`, body);
  }

  delete(serviceType: DashboardServiceType, params?: any): Observable<any> {
    return this.httpSvc.delete(this.getUrl(serviceType), { params });
  }

  detail(serviceType: DashboardServiceType, params: string = ''): Observable<any> {
    return this.httpSvc.get(`${this.getUrl(serviceType)}${params}`);
  }

  list(serviceType: DashboardServiceType, params?: any): Observable<any> {
    return this.httpSvc.get(this.getUrl(serviceType), { params });
  }

  update(serviceType: DashboardServiceType, param: string, body: any): Observable<any> {
    return this.httpSvc.put(`${this.getUrl(serviceType)}${param}`, body);
  }

  getParam(serviceType: DashboardServiceType, parameter: string, params?: any): Observable<any> {
    return this.httpSvc.get(`${this.getUrl(serviceType)}${parameter}`, { params });
  }

  pagedList(serviceType: DashboardServiceType, page: Page, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page.pageNumber.toString());
    httpParams = httpParams.append('size', page.pageSize.toString());

    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }

    return this.httpSvc.get(this.getUrl(serviceType), { params: httpParams });
  }

  pagedListParam(serviceType: DashboardServiceType, page: Page, parameter: string, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page.pageNumber.toString());
    httpParams = httpParams.append('size', page.pageSize.toString());

    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.append(key, params[key]);
        }
      }
    }

    return this.httpSvc.get(`${this.getUrl(serviceType)}${parameter}`, { params: httpParams });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    return this.httpSvc.post<LoginResponse>(this.getUrl(DashboardServiceType.USER_LOGIN), body).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
      })
    );
  }
}

export interface Page {
  pageNumber: number;
  pageSize: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}
