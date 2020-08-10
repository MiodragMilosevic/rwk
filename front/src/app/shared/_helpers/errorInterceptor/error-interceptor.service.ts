import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import { StorageService } from '../../services/storage-service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private storageService: StorageService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.storageService.clearAll();
        this.router.navigate(['/login']);
      }
      return throwError(err.error);
    }));
  }
}

