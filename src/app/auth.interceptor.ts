import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');

    const clonedRequest = token
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        })
      : req;

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized error (token missing or expired)
        if (error.status === 401) {
          this.router.navigate(['/login'], { queryParams: { error: 'sesi telah habis, harap login kembali' } });
        }
        return throwError(() => new Error(error.message)); // Updated throwError syntax
      })
    );
  }
}

