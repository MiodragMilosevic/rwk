import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacebookService } from '../shared/services/facebook.service';
import { UserService } from '../shared/services/user.service';
import { UtilityService } from '../shared/services/utility/utility.service';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { PageService } from '../shared/services/page.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  invalidCredentials: boolean = false;
  instruments:Array<any> = null;
  subscriptions = {params: null};
  token: string = null;
  page: string = 'resetPassword';
  content: any;

  constructor(private userService: UserService, private storageService: StorageService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,
              private config: NgbCarouselConfig, private pageService: PageService) {
                config.interval = 10000;
                config.wrap = true;
                config.keyboard = false
                config.pauseOnHover = false;
                config.showNavigationArrows = false;
      window.scrollTo(0, 0);
      
    }

    getContent() {
      this.pageService.getContent("reset_password").subscribe(res => {
        this.content = res[0].content;
      }, err => {
        console.log("Content of this page is not found");
      })
    }

    boldFirst(str) {
      let first = str.split(' ')[0] + ' ';
      let rest = str.split(' ').slice(1, str.length - 1).join(' ');
      return '<span class="bold">'+first+'</span><span>'+rest+'</span';
    }

  ngOnInit() {
    this.getContent();
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.userService.getInstruments().subscribe(res => {
      this.instruments = res;
    });
    this.subscriptions.params = this.activatedRoute.params.subscribe(
      params => {
        this.token = params['resetToken'];
      }
    )
  }

  resetInput(){
    this.resetPasswordForm.controls.password.setValue("");
    this.resetPasswordForm.controls.confirmPassword.setValue("");
    this.invalidCredentials = false;
  }

  chooseInstrument(index) {
    this.router.navigateByUrl("/instruments/" + this.instruments[index].name);
  }

  resetPasswordSubmit() {
    if (this.resetPasswordForm.invalid){
      this.invalidCredentials = true;
      return;
    }
    if (this.resetPasswordForm.controls.password.value !== this.resetPasswordForm.controls.confirmPassword.value){
      this.invalidCredentials = true;
      return;
    }
    this.invalidCredentials = false;
    this.userService.resetPassword(this.resetPasswordForm.controls.password.value, this.token).subscribe(res => {
      this.resetInput();
      this.page = 'passwordChanged';
    })
  }
}
