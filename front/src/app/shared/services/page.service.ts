import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private http: HttpClient) { }

  getContent(pageName: any) : Observable<any> { 
    return this.http.get(environment.baseUrl + `/infos/?name=${pageName}`);
  }

}
