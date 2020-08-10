import { Injectable } from '@angular/core';
import { UtilityService } from './utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class FacebookService {
 
  constructor(private utilityService: UtilityService) { }

  authenticateViaFacebook() {
    FB.login((response) => {
      if (response.authResponse) {
        let accessToken = response.authResponse.accessToken;
        localStorage.setItem('rsplUserFacebookAccessToken', accessToken);     
        this.utilityService.sendMessage();
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'email'});
  }

}
