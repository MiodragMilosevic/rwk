import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UtilityService {
  private subject = new Subject<any>();

  sendMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}

