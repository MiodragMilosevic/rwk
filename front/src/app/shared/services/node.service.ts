import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private http: HttpClient) { }

  getInstrument(name: any) : Observable<any> {
    return this.http.get(environment.baseUrl + `/instruments?name=${name}`);
  }

  getLevel(instrument_id: any) : Observable<any> {
    return this.http.get(environment.baseUrl + `/instruments/${instrument_id}/levels`);
  }

  getStudyPdf(studyId) : Observable<any> {
    return this.http.get(environment.baseUrl + `/leaves/${studyId}/show_pdf`);
  }

  downloadPdf(studyUrl) : any {
    return this.http.get(studyUrl);
  }

  getPhoto(photoId) : Observable<any> {
    return this.http.get(environment.baseUrl + `/photos/${photoId}`);
  }

}
