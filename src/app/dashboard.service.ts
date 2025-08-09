import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export enum DashboardServiceType {
  USER_LOGIN,
  USER_LOGOUT,
  USER_REGISTER,
  USER_PROFILE,

  //TESTEMONI
  USER_TESTEMONI,

  //UCAPAN
  USER_BUKUTAMU,
  USER_BUKUTAMU_V2,
  USER_BUKUTAMU_V3,

  //RIWAYAT
  USER_PENGUNJUNG_RIWAYAT,
  DELETE_PENGUNJUNG_RIWAYAT_ALL,
  DELETE_PENGUNJUNG_RIWAYAT_SINGLE,

  //REKENING
  SEND_REKENING,
  MD_LIST_BANK,
  REKENING_DATA,
  UPDATE_REKENING,

  //cerita
  CERITA_SUBMIT,
  QUOTE_SUBMIT,
  GALERY_SUBMIT,
  GALERY_DATA,
  SETTINGS_SUBMIT,
  MEMPELAI_SUBMIT,
  MEMPELAI_DATA,
  MEMPELAI_SUBMIT_COVER,
  MEMPELAI_UPDATE,

  //konfirmasi pembayaran
  RDM_CONFIRM_PAYMENT,

  //ACARA
  ACARA_DATA,
  ACARA_SUBMIT_COUNTDOWN,
  SETTINGS_GET_FILTER,
  ACARA_SUBMIT_DYNAMIC,
  ACARA_SUBMIT_UPDATE_COUNTDOWN,
  ACARA_SUBMIT_UPDATE_DYNAMIC,
  ACARA_SUBMIT_DELETE_DYNAMIC,

  //SETTINGS ADMIN BUNDLE
  ST_BUNDLE_ADMIN,

  //MANUAL REGIS
  MNL_STEP_ONE,
  MNL_STEP_THREE,
  MNL_STEP_FOUR,
  MNL_STEP_TWO,
  MNL_MD_METHOD,
  MNL_MD_PACK_INVITATION,

  //ADMIN
  ADM_TESTI,
  ADM_TESTI_DELETE_ALL,

  ADM_IDX_DASHBOARD,
  MNL_MD_METHOD_DETAIL,
  MD_RGS_PAYMENT,
  ADM_MANUAL_PAYMENT,
  ADM_ADD_REKENING,
  ADM_TRIPAY_PAYMENT,
  ADM_MIDTRANS_PAYMENT,

  ADM_ADD_CATEGORY,
  ADM_EDIT_CATEGORY,
  ADM_DELETE_CATEGORY,
  ADM_DELETE_ALL_CATEGORY,
  ADM_GET_CATEGORY,

  // setting user
  USER_SETTINGS_SUBMIT_DOMAIN,
  USER_SETTINGS_SUBMIT_MUSIC,
  USER_SETTINGS_SUBMIT_SALAM,
  USER_SETTINGS_SUBMIT_MUSIC_DOWNLOAD,
  USER_SETTINGS_SUBMIT_MUSIC_GET,
  USER_SETTINGS_SUBMIT_FILTER,
  USER_SETTINGS_SUBMIT_FILTER_UPDATE,
  USER_SETTINGS_SUBMIT_LIST_FILTER,
  USER_SETTINGS_DELETE_MUSIC,
  GALERY_DELETE,
  CERITA_DATA,
  CERITA_UPDATE,
  QUOTE_DATA,
  QUOTE_UPDATE,
  CERITA_DELETE,
  QUOTE_DELETE,

}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private BASE_URL_API = 'http://127.0.0.1:8000/api';

  constructor(private httpSvc: HttpClient) { }

  private getUrl(serviceType: DashboardServiceType): string {
    switch (serviceType) {

      case DashboardServiceType.USER_LOGIN:
        return `${this.BASE_URL_API}/v1/login`;

      case DashboardServiceType.USER_LOGOUT:
        return `${this.BASE_URL_API}/v1/logout`;

      case DashboardServiceType.USER_REGISTER:
        return `${this.BASE_URL_API}/v1/register`;

      case DashboardServiceType.USER_PROFILE:
        return `${this.BASE_URL_API}/v1/user-profile`;

      //MANUAL REGIS
      case DashboardServiceType.MNL_STEP_ONE:
        return `${this.BASE_URL_API}/v1/one-step`;

      case DashboardServiceType.MNL_STEP_TWO:
        return `${this.BASE_URL_API}/v1/two-step`;

      case DashboardServiceType.MNL_STEP_THREE:
        return `${this.BASE_URL_API}/v1/three-step`;

      case DashboardServiceType.MNL_STEP_FOUR:
        return `${this.BASE_URL_API}/v1/for-step`;

      case DashboardServiceType.MNL_MD_METHOD:
        return `${this.BASE_URL_API}//v1/master-tagihan`;

      case DashboardServiceType.MNL_MD_METHOD_DETAIL:
        return `${this.BASE_URL_API}/v1/list-methode-transaction/all`;

      case DashboardServiceType.MNL_MD_PACK_INVITATION:
        return `${this.BASE_URL_API}/v1/paket-undangan`;

      //testemoni
      case DashboardServiceType.USER_TESTEMONI:
        return `${this.BASE_URL_API}/v1/user/post-testimoni`;

      //Ucapan
      case DashboardServiceType.USER_BUKUTAMU:
        return `${this.BASE_URL_API}/v1/user/result-bukutamu`;

      case DashboardServiceType.USER_BUKUTAMU_V2:
        return `${this.BASE_URL_API}/v1/user/buku-tamu`;

      case DashboardServiceType.USER_BUKUTAMU_V3:
        return `${this.BASE_URL_API}/v1/user/buku-tamu/delete-all`;

      //RIWAYAT PENGUNJUNG
      case DashboardServiceType.USER_PENGUNJUNG_RIWAYAT:
        return `${this.BASE_URL_API}/v1/user/result-pengunjung`;

      case DashboardServiceType.DELETE_PENGUNJUNG_RIWAYAT_ALL:
        return `${this.BASE_URL_API}/v1/user/pengunjung/delete-all`;

      case DashboardServiceType.DELETE_PENGUNJUNG_RIWAYAT_SINGLE:
        return `${this.BASE_URL_API}/v1/user/pengunjung`;

      //REKENING
      case DashboardServiceType.SEND_REKENING:
        return `${this.BASE_URL_API}/v1/user/send-rekening`;
      case DashboardServiceType.MD_LIST_BANK:
        return `${this.BASE_URL_API}/v1/all-bank`;
      case DashboardServiceType.REKENING_DATA:
        return `${this.BASE_URL_API}/v1/user/get-rekening`;
      case DashboardServiceType.UPDATE_REKENING:
        return `${this.BASE_URL_API}/v1/user/update-rekening`;

      //CERITA
      case DashboardServiceType.CERITA_SUBMIT:
        return `${this.BASE_URL_API}/v1/user/send-cerita`;
      case DashboardServiceType.CERITA_DATA:
        return `${this.BASE_URL_API}/v1/user/list-cerita`;
      case DashboardServiceType.CERITA_UPDATE:
        return `${this.BASE_URL_API}/v1/user/update-cerita`;
      case DashboardServiceType.CERITA_DELETE:
        return `${this.BASE_URL_API}/v1/user/delete-cerita`;


      // Quote
      case DashboardServiceType.QUOTE_SUBMIT:
        return `${this.BASE_URL_API}/v1/user/send-qoute`;
      case DashboardServiceType.QUOTE_DATA:
        return `${this.BASE_URL_API}/v1/user/list-qoute`;
      case DashboardServiceType.QUOTE_UPDATE:
        return `${this.BASE_URL_API}/v1/user/update-qoute`;
      case DashboardServiceType.QUOTE_DELETE:
        return `${this.BASE_URL_API}/v1/user/delete-qoute`;

      //GALERY
      case DashboardServiceType.GALERY_SUBMIT:
        return `${this.BASE_URL_API}/v1/user/submission-galery`;
      case DashboardServiceType.GALERY_DATA:
        return `${this.BASE_URL_API}/v1/user/list-galery`;
      case DashboardServiceType.GALERY_DELETE:
        return `${this.BASE_URL_API}/v1/user/delete-galery`;

      // Settings
      case DashboardServiceType.SETTINGS_SUBMIT:
        return `${this.BASE_URL_API}/v1/user/settings/`;
      case DashboardServiceType.SETTINGS_GET_FILTER:
        return `${this.BASE_URL_API}/v1/user/list-data-setting`;

      //MEMPELAI
      case DashboardServiceType.MEMPELAI_DATA:
        return `${this.BASE_URL_API}/v1/user/get-mempelai`;
      case DashboardServiceType.MEMPELAI_SUBMIT:
        return `${this.BASE_URL_API}/v1/user/submission-mempelai`;
      case DashboardServiceType.MEMPELAI_SUBMIT_COVER:
        return `${this.BASE_URL_API}/v1/user/submission-cover-mempelai`;
      case DashboardServiceType.MEMPELAI_UPDATE:
        return `${this.BASE_URL_API}/v1/user/update-mempelai`;

      //ACARA
      case DashboardServiceType.ACARA_DATA:
        return `${this.BASE_URL_API}/v1/user/acara`;
      case DashboardServiceType.ACARA_SUBMIT_COUNTDOWN:
        return `${this.BASE_URL_API}/v1/user/submission-countdown`;
      case DashboardServiceType.ACARA_SUBMIT_DYNAMIC:
        return `${this.BASE_URL_API}/v1/user/submission-acara`;
      case DashboardServiceType.ACARA_SUBMIT_UPDATE_COUNTDOWN:
        return `${this.BASE_URL_API}/v1/user/update-countdown/`;
      case DashboardServiceType.ACARA_SUBMIT_UPDATE_DYNAMIC:
        return `${this.BASE_URL_API}/v1/user/update-acara`;
      case DashboardServiceType.ACARA_SUBMIT_DELETE_DYNAMIC:
        return `${this.BASE_URL_API}/v1/user/delete-countdown`;

      //SETTINGS BUNDLE ADMIN
      case DashboardServiceType.ST_BUNDLE_ADMIN:
        return `${this.BASE_URL_API}/v1/admin/paket-undangan`;


      //TESTIMONI ADMIN
      case DashboardServiceType.ADM_TESTI:
        return `${this.BASE_URL_API}/v1/admin/testimoni`;
      case DashboardServiceType.ADM_TESTI_DELETE_ALL:
        return `${this.BASE_URL_API}/v1/admin/testimoni/delete-all`;

      //ADMIN GET USER DATA
      case DashboardServiceType.ADM_IDX_DASHBOARD:
        return `${this.BASE_URL_API}/v1/admin/get-users`;

      //master payment
      case DashboardServiceType.MD_RGS_PAYMENT:
        return `${this.BASE_URL_API}/v1/master-tagihan`;

      //PEMBAYARAN ADMIN

      case DashboardServiceType.ADM_TRIPAY_PAYMENT:
        return `${this.BASE_URL_API}/v1/admin/send-tripay`;
      case DashboardServiceType.ADM_MIDTRANS_PAYMENT:
        return `${this.BASE_URL_API}/v1/admin/send-midtrans`;
      case DashboardServiceType.ADM_ADD_REKENING:
        return `${this.BASE_URL_API}/v1/admin/send-rekening`;
      case DashboardServiceType.RDM_CONFIRM_PAYMENT:
        return `${this.BASE_URL_API}/v1/update/status-bayar`;

      // Kategori
      case DashboardServiceType.ADM_ADD_CATEGORY:
        return `${this.BASE_URL_API}/v1/admin/add-categorys`;
      case DashboardServiceType.ADM_EDIT_CATEGORY:
        return `${this.BASE_URL_API}/v1/admin/update-categorys`;
      case DashboardServiceType.ADM_DELETE_CATEGORY:
        return `${this.BASE_URL_API}/v1/admin/delete-categorys`;
      case DashboardServiceType.ADM_DELETE_ALL_CATEGORY:
        return `${this.BASE_URL_API}/v1/admin/delete-all-categorys`;
      case DashboardServiceType.ADM_GET_CATEGORY:
        return `${this.BASE_URL_API}/v1/admin/categorys`;


      // User Settings
      case DashboardServiceType.USER_SETTINGS_SUBMIT_DOMAIN:
        return `${this.BASE_URL_API}/v1/user/settings/domain`;
      case DashboardServiceType.USER_SETTINGS_SUBMIT_MUSIC:
        return `${this.BASE_URL_API}/v1/user/settings/music`;
      case DashboardServiceType.USER_SETTINGS_SUBMIT_SALAM:
        return `${this.BASE_URL_API}/v1/user/settings/salam`;
      case DashboardServiceType.USER_SETTINGS_SUBMIT_MUSIC_DOWNLOAD:
        return `${this.BASE_URL_API}/v1/user/music/download`;
      case DashboardServiceType.USER_SETTINGS_SUBMIT_MUSIC_GET:
        return `${this.BASE_URL_API}/v1/user/music/stream`;
      case DashboardServiceType.USER_SETTINGS_SUBMIT_FILTER:
        return `${this.BASE_URL_API}/v1/user/submission-filter`;
      case DashboardServiceType.USER_SETTINGS_SUBMIT_FILTER_UPDATE:
        return `${this.BASE_URL_API}/v1/user/submission-filter-update`;
      case DashboardServiceType.USER_SETTINGS_SUBMIT_LIST_FILTER:
        return `${this.BASE_URL_API}/v1/user/list-data-setting`;
      case DashboardServiceType.USER_SETTINGS_DELETE_MUSIC:
        return `${this.BASE_URL_API}/v1/user/music/delete`;


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

  deleteV2(serviceType: DashboardServiceType, id?: number, params?: any): Observable<any> {
    const baseUrl = this.getUrl(serviceType); // Get the base URL
    const url = id !== undefined ? `${baseUrl}/${id}` : baseUrl; // Append the ID if provided
    return this.httpSvc.delete(url, { params });
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

export class QueryService {
  constructor() { }

  convert(params: any) {
    return '?' + new URLSearchParams(params).toString();
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
