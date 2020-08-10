import { Component, OnInit, OnDestroy, NgZone, Input, HostListener, AfterViewInit, AfterContentChecked } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

import { FacebookService } from '../shared/services/facebook.service';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { UtilityService } from '../shared/services/utility/utility.service';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageService } from '../shared/services/page.service';
import { environment } from 'src/environments/environment';
import { NodeService } from '../shared/services/node.service';
import { InstrumentService } from '../shared/services/utility/instrument.service';
import * as _ from 'lodash';
import { LevelService } from '../shared/services/utility/level.service';
import { LinkService } from '../shared/services/utility/link.service';
import * as jquery from 'jquery';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NgbCarouselConfig]
})
export class LoginComponent implements OnInit, OnDestroy {

  subscription : Subscription;
  page: String = 'homePage';
  subscriptionPage: Subscription;
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  invalidCredentials: boolean = false;
  instruments:Array<any> = null;
  content: any;
  china: any;
  user: any;
  userId: any;
  imagePreview: any;
  instrumentIndex: any;
  currentInstrument: any = null;
  loadPage: any = false;
  subscriptionInstrument: Subscription;
  subscriptionLevel: Subscription;
  levelIndex: any;
  currentLevel: any;
  levels: Array<any> = [];
  instrumentsPanding: Array<any> = null;
  height: any = 0;
  cookie: any = true;
  bool: any = false;

  constructor(private facebookService: FacebookService, private userService: UserService, private utilityService: UtilityService, private storageService: StorageService, private formBuilder: FormBuilder, private router: Router,
              private pageService: PageService, private config: NgbCarouselConfig, private ngZone: NgZone, private nodeService: NodeService, 
              private instrumentService: InstrumentService, private levelService: LevelService, private linkService: LinkService) {
    
    this.subscriptionPage = this.linkService.getMessage().subscribe(page => {
      this.page = page;
    });
    
    if (this.storageService.getCurrentUser())  {
      this.getLicences();
      this.cookie = false;
    }
    else {
      if (localStorage.getItem('cookie')) {
          this.cookie = false;
      }
      else localStorage.setItem('cookie', 'yes');
      this.loadPage = true;
    };
    config.interval = 10000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationArrows = false;
    window.scrollTo(0, 0);
    if (environment.china == true) this.china = true;
    else this.china = false;  
    
  }

  classroom() {
    this.router.navigateByUrl("/profile");
  }

  @HostListener('window:scroll', ['$event'])
    onWindowScroll($event) {
        jquery('.alert-rectangle').css('top','calc(100% - ' + this.height + 'px)');
    }


  onResized(event: ResizedEvent) {
    this.height = event.newHeight;
    jquery('.alert-rectangle').css('top','calc(100% - ' + this.height + 'px)');
  }

  getContent() {
    this.pageService.getContent("login").subscribe((data) => {
      this.content = data[0].content;
    }, err => {
      console.log("Content of this page is not found");
    });
  }

  getLicences() {
    this.loadPage = false;
    this.userService.getLicences(this.storageService.getCurrentUser().id, 'approved').subscribe(res => {
      if (res.length == 0){
        this.userService.getLicences(this.storageService.getCurrentUser().id, 'pending').subscribe(res => {
          if (res.length == 0){
            this.router.navigateByUrl('/instruments-info');
          } else {
            this.instrumentsPanding = new Array();
            this.levels = new Array();
            for (let i = 0; i < res.length; i++){
            let startDate = new Date(res[i].start_date);
            let endDate = new Date(res[i].end_date);
            if (startDate.getTime() <= Date.now() && endDate.getTime() >= Date.now()){
              if (!this.instrumentsPanding.some((item)=> item.id == res[i].instrument.id)) this.instrumentsPanding.push(res[i].instrument);
              let index = this.instrumentsPanding.findIndex(record => record.id == res[i].instrument.id);
              if (this.levels[index] == null) this.levels[index] = new Array();
              this.levels[index].push(res[i].level);
            }
          }
          for (let i = 0; i < this.levels.length; i++){
            if (this.levels[i].length > 1)
            this.levels[i].sort(function (a, b) {
              return a.position - b.position;
            })
          }
          if (this.instrumentsPanding.length == 0 || this.levels.length == 0){
            this.router.navigateByUrl('/instruments-info');
          }
          this.loadPage = true;
          this.instrumentIndex = 0;
          this.levelIndex = 0;
          this.subscriptionInstrument = this.instrumentService.getMessage().subscribe(instrumentIndex => {
            this.instrumentIndex = instrumentIndex;
            this.currentInstrument = this.instrumentsPanding[this.instrumentIndex];
            this.levelIndex = 1;
          });
          this.subscriptionLevel = this.levelService.getMessage().subscribe(levelIndex => {
            this.levelIndex = levelIndex + 1;
          });
          this.loadPage = true;
          this.currentInstrument = this.instrumentsPanding[this.instrumentIndex];
          if (this.levels[this.instrumentIndex])
          this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];

          this.subscriptions();
          }
        });
      } else {
        this.instrumentsPanding = new Array();
        this.levels = new Array();
        for (let i = 0; i < res.length; i++){
          let startDate = new Date(res[i].start_date);
          let endDate = new Date(res[i].end_date);
          if (startDate.getTime() <= Date.now() && endDate.getTime() >= Date.now()){
            if (!this.instrumentsPanding.some((item)=> item.id == res[i].instrument.id)) this.instrumentsPanding.push(res[i].instrument);
            let index = this.instrumentsPanding.findIndex(record => record.id == res[i].instrument.id);
            if (this.levels[index] == null) this.levels[index] = new Array();
            this.levels[index].push(res[i].level);

          }
        }
        for (let i = 0; i < this.levels.length; i++){
          if (this.levels[i].length > 1)
          this.levels[i].sort(function (a, b) {
            return a.position - b.position;
          })
        }
        if (this.instrumentsPanding.length == 0 || this.levels.length == 0){
          this.router.navigateByUrl('/instruments-info');
        }
        this.loadPage = true;
        this.instrumentIndex = 0;
        this.levelIndex = 0;
        this.currentInstrument = this.instrumentsPanding[this.instrumentIndex];
        if (this.levels[this.instrumentIndex])
        this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
        this.subscriptions();
      }
        
    });
  }

    subscriptions(){
      this.subscriptionInstrument = this.instrumentService.getMessage().subscribe(instrumentIndex => {
        this.instrumentIndex = instrumentIndex;
        this.currentInstrument = this.instrumentsPanding[this.instrumentIndex];
        if (this.levels[this.instrumentIndex])
        this.levelIndex = this.levels[this.instrumentIndex][0].name;
      });
      this.subscriptionLevel = this.levelService.getMessage().subscribe(levelIndex => {
        if (this.levels[this.instrumentIndex])
        this.levelIndex = this.levels[this.instrumentIndex][levelIndex].name;
      });
      this.loadPage = true;
      this.currentInstrument = this.instrumentsPanding[this.instrumentIndex];
      if (this.levels[this.instrumentIndex])
      this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
    }

  boldFirst(str) {
    let first = str.split(' ')[0] + ' ';
    let rest = str.split(' ').slice(1, str.length - 1).join(' ');
    return '<span class="bold">'+first+'</span><span>'+rest+'</span';
  }

  registerPage() {
    this.router.navigate(['/register']);
  }

  ngOnInit() {
    this.getContent(); 
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required]]
    });
    this.userService.getInstruments().subscribe(res => {
      this.instruments = res;
    })
    if (this.storageService.getCurrentUser()) {
      this.page = 'userLoggedIn';
      this.userId = this.storageService.getCurrentUser().id;
      this.userService.getUser(this.userId).subscribe(res => {
        this.user = res;
        if (this.user.photo_id)
        this.userService.getPhoto(this.user.photo_id).subscribe((photo) => {
          this.imagePreview = photo.image.url;
          
        }, err => {
             console.log("Error");
        });
      }, err => {
        this.storageService.clearAll();
        this.router.navigateByUrl('/home');
      })
    }
    this.subscription = this.utilityService.getMessage().subscribe(() => {
      this.userService.loginWithFacebook().subscribe((data) => {
        this.storageService.saveUserData(data);
        this.storageService.setToken(data.authorization.token);
        this.ngZone.run(() =>  { this.router.navigate(['/profile']); } );
      });
    });
  }

  ngOnDestroy(){
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionInstrument)
      this.subscriptionInstrument.unsubscribe();
    if (this.subscriptionLevel)
      this.subscriptionLevel.unsubscribe();
    if (this.subscriptionPage)
      this.subscriptionPage.unsubscribe();
  }

  loginViaFacebook() {
    this.facebookService.authenticateViaFacebook();
  }

  resetInput(){
    this.loginForm.controls.username.setValue("");
    this.loginForm.controls.password.setValue("");
    this.invalidCredentials = false;
  }

  startPage() {
    this.invalidCredentials = false;
    this.resetInput();
    this.page = 'homePage';
  }

  loginUsernamePage() {
    this.page = 'loginUsernamePage';
  }

  forgotPasswordPage() {
    this.page = 'forgotPasswordPage';
    this.resetInput();
  }

  resendEmail() {
    this.userService.sendForgotPasswordRequest(this.forgotPasswordForm.controls.email.value).subscribe(res => {
      this.page = 'emailSentPage';
    }, err => {
      this.invalidCredentials = true;
    });
  }

  chooseInstrument(index) {
    this.router.navigateByUrl("/instruments/" + this.instruments[index].name);
  }

  forgotPasswordSubmit() {
    if (this.forgotPasswordForm.invalid){
      this.invalidCredentials = true;
      return;
    }
    this.userService.sendForgotPasswordRequest(this.forgotPasswordForm.controls.email.value).subscribe(res => {
      this.page = 'emailSentPage';
    }, err => {
      this.invalidCredentials = true;
    })
  }

  loginSubmit() {
    if (this.loginForm.invalid){
      this.invalidCredentials = true;
      return;
    }
    this.userService.loginWithUsername(this.loginForm.controls.username.value, this.loginForm.controls.password.value).subscribe(res => {
      this.storageService.saveUserData(res);
      this.storageService.setToken(res.authorization.token);
      this.router.navigateByUrl("/profile");
      this.invalidCredentials = false;
    }, err => {
      this.invalidCredentials = true;
      return;
    })
  }



}

