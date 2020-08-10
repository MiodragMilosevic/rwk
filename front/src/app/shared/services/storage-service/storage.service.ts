import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  setToken(token) {
    localStorage.setItem('rwk-token', token);
  }

  getToken() {
    return localStorage.getItem('rwk-token');
  }

  setType(i: number) {
    localStorage.setItem('typeOfLanguage', i + '');
  }

  getType() {
    return localStorage.getItem('typeOfLanguage');
  }

  clearAll() {
    localStorage.clear();
  }

  saveUserData(data) {
    localStorage.setItem('rwk-user', JSON.stringify(data));
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('rwk-user'));
  }
}
