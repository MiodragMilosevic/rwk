import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CentreService {

  constructor(private http: HttpClient) { }

  getAllCentres() : Observable<any> {
    return this.http.get(environment.baseUrl + `/centres`);
  }

  getAllCountries() : Observable<any> {
    return this.http.get(environment.baseUrl + '/countries');
  }

  getCountry(countryName: string) : Observable<any> {
    return this.http.get(environment.baseUrl + `/countries?name=${countryName}`)
  }
}
