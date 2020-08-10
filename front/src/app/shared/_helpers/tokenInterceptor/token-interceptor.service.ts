import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpInterceptor} from '@angular/common/http';
import {StorageService} from '../../services/storage-service/storage.service';
import { environment } from 'src/environments/environment';
import { Globals } from 'src/app/global';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    private storageService: StorageService, private globals: Globals
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.storageService.getToken();
    const locale = this.storageService.getType();
    let language;
    if (locale == null){
      if (environment.china == true) {
        language = 'zh';
        this.storageService.setType(0);
      }
      else {
        language = 'en';
        this.storageService.setType(1);
      }
      
    } else if (locale == '1'){
      language = 'en';
    } else if (locale == '2'){
      language = 'es';
    } else if (locale == '0') {
      language = 'zh';
    }
    if (token) {
      if (request.url.includes(environment.baseUrl + "/photos")) {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token,
            'Accept': 'application/json',
            'Locale': language
          }
        });
      }
      else if (!request.url.includes('maps.googleapis.com')){
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Locale': language
          }
        });
      } else {
        request = request.clone({
          setHeaders: {
            'Accept': 'application/json'
          }
        });
      }
    } else {
      if (!request.url.includes('maps.googleapis.com')) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Locale': language
        }
      });
    } else {
      request = request.clone({
        setHeaders: {
          'Accept': 'application/json'
        }
      });
    }
    }
    return next.handle(request);
  }
}
