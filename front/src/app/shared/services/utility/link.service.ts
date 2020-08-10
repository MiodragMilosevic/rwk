import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  private subject = new BehaviorSubject<any>('homePage');

  sendMessage(message: any) {
    this.subject.next(message);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

}

