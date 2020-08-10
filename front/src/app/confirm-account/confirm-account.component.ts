import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../shared/services/storage-service/storage.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss']
})
export class ConfirmAccountComponent implements OnInit {
  subscriptions = { params: null };
  token: string;

  constructor(private userService: UserService, private router: Router, private storageService: StorageService, private activatedRoute: ActivatedRoute) { 
    window.scrollTo(0, 0);
  }

  ngOnInit() {
    this.subscriptions.params = this.activatedRoute.params.subscribe(
      params => {
        this.token = params['confirmToken'];
        this.userService.confirmAccount(this.token).subscribe(res => {
          this.storageService.saveUserData(res);
          this.storageService.setToken(res.authorization.token);
          this.router.navigateByUrl("/profile");
        }, err => {
          this.router.navigateByUrl['/home'];
        })

        
      }
    );
  }

}
