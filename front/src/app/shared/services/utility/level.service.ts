import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

  private subject = new BehaviorSubject<any>(0);

  sendMessage(message: any) {
    this.subject.next(message);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}

