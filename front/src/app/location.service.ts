import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getCountry(position) : Observable<any> {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.latitude},${position.longitude}&sensor=false&key=AIzaSyDU9kmYBPwPoxiT3ZFH3okupN3BcZM9q5k`);
  }

  public getPosition(): Observable<Position> {
    return Observable.create(
      (observer) => {
        navigator.geolocation.getCurrentPosition((pos: Position) => {
          observer.next(pos);
        }),
          () => {
            alert('Position is not available');
          },
          {
            enableHighAccuracy: true
          };
      });
  }
}
