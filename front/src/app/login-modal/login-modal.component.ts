import { Component, OnInit, NgZone } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageService } from '../shared/services/page.service';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { FacebookService } from '../shared/services/facebook.service';
import { Subscription } from 'rxjs';
import { UtilityService } from '../shared/services/utility/utility.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  content: any;
  loginForm: FormGroup;
  invalidCredentials: boolean = false;
  page: any = "loginUsernamePage";
  subscription : Subscription;
  china: any = false;
  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private pageService: PageService, private modalService: NgbModal,
    private userService: UserService, private router: Router, private storageService: StorageService, private activatedRoute: ActivatedRoute,
    private facebookService: FacebookService, private utilityService: UtilityService, private ngZone: NgZone) { }

  ngOnInit() {
    this.getContent();
    this.createLoginFormGroup();
    this.subscription = this.utilityService.getMessage().subscribe(() => {
      this.userService.loginWithFacebook().subscribe((data) => {
        this.storageService.saveUserData(data);
        this.storageService.setToken(data.authorization.token);
        this.activeModal.close(this.getUser(data));       
      });
    });

    if (environment.china == true) this.china = true;
    else this.china = false;
  }

  getContent() {
    this.pageService.getContent("login-modal").subscribe(res => {
      this.content = res[0].content;
    }, err => {
      console.log("Content of this page is not found");
    })
  }

  get formGroup() {
    return this.loginForm.controls;
  }

  createLoginFormGroup() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  getUser(response: any) {
    return {
      id: response.id
    }
  }

  loginSubmit() {
    if (this.loginForm.invalid){
      this.invalidCredentials = true;
      return;
    }
    this.userService.loginWithUsername(this.loginForm.controls.username.value, this.loginForm.controls.password.value).subscribe(res => {
      this.storageService.saveUserData(res);
      this.storageService.setToken(res.authorization.token);
      this.invalidCredentials = false;
      this.activeModal.close(this.getUser(res));
    }, err => {
      this.invalidCredentials = true;
      return;
    })
  }

  loginViaFacebook() {
    this.facebookService.authenticateViaFacebook();
  }

}
