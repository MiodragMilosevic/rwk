import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  loginWithFacebook() : Observable<any>{
    const data = {
      access_token: localStorage.getItem('rsplUserFacebookAccessToken'),
      provider: "facebook"
    };
    return this.http.post(environment.baseUrl + '/users/authenticate', data);
  }

  getLevels(instrumentId) : Observable<any>{
    return this.http.get(environment.baseUrl + `/instruments/${instrumentId}/levels`);
  }

  updateUser(id: any, data: any) : Observable<any> {
    return this.http.put(`${environment.baseUrl}/users/${id}`, data);
  }

  deleteAccount(id: any) : Observable<any> {
    return this.http.delete(`${environment.baseUrl}/users/${id}`);
  }
 
  changePassword(id: any, data: any) : Observable<any> {
    const sendData = {
        password_digest: data.password_digest,
        password: data.password_confirmation,
        password_confirmation: data.password_confirmation
    }
    return this.http.put(`${environment.baseUrl}/users/${id}/change_password`, sendData);
  }

  getAccessibleLevels(instrumentId) : Observable<any>{
    return this.http.get(environment.baseUrl + `/levels/accessible?instrument_id=${instrumentId}`);
  }

  getPendingLevels(instrumentId) : Observable<any> {
    return this.http.get(environment.baseUrl + `/levels/pending?instrument_id=${instrumentId}`);
  }

  getLicences(userId, status) : Observable<any> {
    return this.http.get(environment.baseUrl + `/users/${userId}/node_licences?status=${status}`);
  }

  getUser(userId) : Observable<any> {
    return this.http.get(environment.baseUrl + `/users/${userId}`);
  }

  getCategories(levelId) : Observable<any> {
    return this.http.get(environment.baseUrl + `/levels/${levelId}/categories`);
  }

  getStudies(categoryId) : Observable<any> {
    return this.http.get(environment.baseUrl + `/leaves?category_id=${categoryId}`);
  }

  loginWithUsername(username, password) : Observable<any> {
    const data = {
      username: username,
      password: password,
      provider: "username"
    };
    return this.http.post(environment.baseUrl + '/users/authenticate', data);
  }

  sendForgotPasswordRequest(email) : Observable<any> {
    const data =  {
      email_address: email
    };
    return this.http.post(environment.baseUrl + '/users/forgot_password', data);
  }

  resetPassword(password, token) : Observable<any> {
    const data = {
      password: password,
      token: token
    };
    return this.http.put(environment.baseUrl + '/users/reset_password', data);
  }

  getInstruments() : Observable<any> {
    return this.http.get(environment.baseUrl + '/instruments');
  }

  getPendingLicence() : Observable<any> {
    return this.http.get(environment.baseUrl + `/node_licences?status=pending`);
  }

  getApprovedLicence() : Observable<any> {
    return this.http.get(environment.baseUrl + '/node_licences?status=approved');
  }

  confirmAccount(confirmToken) : Observable<any> {
    let data = {
      token: confirmToken
    }
    return this.http.post(environment.baseUrl + '/users/confirm_account', data);
  }

  getAccessibleInstruments() : Observable<any> {
    return this.http.get(environment.baseUrl + '/instruments/accessible');
  }

  getPendingInstruments() : Observable<any> {
    return this.http.get(environment.baseUrl + '/instruments/pending');
  }

  register(user: any) : Observable<any> {  
    const data = {
      first_name: user.first_name,
      email_address: user.email_address,
      last_name: user.last_name,
      username: user.username,
      date_of_birth: user.date_of_birth,
      password: user.password,
      telephone: user.telephone
    }
    return this.http.post(environment.baseUrl + '/users', data);
  }

  createUserRole(userRole: any) : Observable<any> { 
    const data = {
      role: userRole.role
    }
    let user_id = userRole.user_id;
    return this.http.post(environment.baseUrl + `/users/${user_id}/user_roles`, data);
  }
  
  createCustomer(userId: any, token: any) : Observable<any>{
    const data = {
      stripe_token: token
    };
    return this.http.post(environment.baseUrl + `/users/${userId}/stripe`, data);
  }

  createImage(image): Observable<any> {
    let formData = new FormData();
    formData.append('image', image);
    return this.http.post(environment.baseUrl + '/photos', formData);
  }

  uploadImage(id, idPhoto): Observable<any> {
    const data = {
      photo_id: idPhoto
    }
    return this.http.put(`${environment.baseUrl}/users/${id}`, data);
  }

  getPhoto(id) : Observable<any> {
    return this.http.get(`${environment.baseUrl}/photos/${id}`);
  }

  setDisclaimer(id, disclaimer) : Observable<any> {
    const data =  {
        disclaimer: disclaimer
    };
    return this.http.put(`${environment.baseUrl}/users/${id}`, data);
  }
}
