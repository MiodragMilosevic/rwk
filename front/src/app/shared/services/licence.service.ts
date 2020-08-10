import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LicenceService {

  constructor(private http: HttpClient) { }

  createLicence(levelId: any) : Observable<any> {
    const data = {
      node_id: levelId
    };
    return this.http.post(environment.baseUrl + "/node_licences", data);
  }

  activateLicence(activationCode: any) : Observable<any> {
    const data = {
      activation_code: activationCode
    };    
    return this.http.post(environment.baseUrl + "/node_licences/activate", data);
  }

}
