import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { NodeService } from '../shared/services/node.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../shared/services/storage-service/storage.service';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageService } from '../shared/services/page.service';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';
import { InstrumentService } from '../shared/services/utility/instrument.service';
import { LevelService } from '../shared/services/utility/level.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  currentInstrument: any;
  currentLevel: any;
  settingsPage: boolean = false;
  instruments: Array<any>;
  instrumentIndex: number;
  subscriptions: any;
  userId: any;
  user: any;
  levels: Array<any> = [];
  levelIndex: number;
  imagePreview: any;
  settingsForm: FormGroup;
  submitted: boolean;
  startDate: any;
  today: any;
  message: any;
  content: any;
  subscription: any;
  facebook_id: boolean = false;
  load: boolean = false;
  subscriptionInstrument: any;
  subscriptionLevel: any;

  constructor(private userService: UserService, private pageService: PageService, private nodeService: NodeService, private router: Router, private storageService: StorageService,
    private formBuilder: FormBuilder, private calendar: NgbCalendar, private parserFormatter: NgbDateParserFormatter, private instrumentService: InstrumentService, private levelService: LevelService,
    private modalService: NgbModal) {
    window.scrollTo(0, 0);
  }

  subscriptions1() {
    this.subscriptionInstrument = this.instrumentService.getMessage().subscribe(instrumentIndex => {
      this.instrumentIndex = instrumentIndex;
      this.currentInstrument = this.instruments[this.instrumentIndex];
      if (this.levels[this.instrumentIndex])
      this.levelIndex = this.levels[this.instrumentIndex][0].name;
    });
    this.subscriptionLevel = this.levelService.getMessage().subscribe(levelIndex => {
      if (this.levels[this.instrumentIndex])
      this.levelIndex = this.levels[this.instrumentIndex][levelIndex].name;
    });
    this.currentInstrument = this.instruments[this.instrumentIndex];
    if (this.levels[this.instrumentIndex])
    this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
  }

  getContent() {
    this.pageService.getContent("settings").subscribe(res => {
      this.content = res[0].content;
      this.load = true;
    }, err => {
      console.log("Content of this page is not found");
    })
  }

  getLicences() {
    this.settingsPage = true;
    this.userService.getLicences(this.storageService.getCurrentUser().id, 'approved').subscribe(res => {
      if (res.length == 0) {
        this.userService.getLicences(this.storageService.getCurrentUser().id, 'pending').subscribe(res => {
          if (res.length == 0) {
            this.currentInstrument = null;
            this.levels = null;
          } else {
            this.instruments = new Array();
            this.levels = new Array();
            for (let i = 0; i < res.length; i++) {
              let startDate = new Date(res[i].start_date);
              let endDate = new Date(res[i].end_date);
              if (startDate.getTime() <= Date.now() && endDate.getTime() >= Date.now()) {
                if (!this.instruments.some((item) => item.id == res[i].instrument.id)) this.instruments.push(res[i].instrument);
                let index = this.instruments.findIndex(record => record.id == res[i].instrument.id);
                if (this.levels[index] == null) this.levels[index] = new Array();
                this.levels[index].push(res[i].level);
              }
            }
            for (let i = 0; i < this.levels.length; i++) {
              if (this.levels[i].length > 1)
                this.levels[i].sort(function (a, b) {
                  return a.position - b.position;
                })
            }
            if (this.instruments.length == 0 || this.levels.length == 0) {
              this.currentInstrument = null;
              this.levels = null;
            }
            this.instrumentIndex = 0;
            this.levelIndex = 0;
            this.currentInstrument = this.instruments[this.instrumentIndex];
            if (this.levels[this.instrumentIndex])
            this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
            this.subscriptions1();
          }
        });
      } else {
        this.instruments = new Array();
        this.levels = new Array();
        for (let i = 0; i < res.length; i++) {
          let startDate = new Date(res[i].start_date);
          let endDate = new Date(res[i].end_date);
          if (startDate.getTime() <= Date.now() && endDate.getTime() >= Date.now()) {
            if (!this.instruments.some((item) => item.id == res[i].instrument.id)) this.instruments.push(res[i].instrument);
            let index = this.instruments.findIndex(record => record.id == res[i].instrument.id);
            if (this.levels[index] == null) this.levels[index] = new Array();
            this.levels[index].push(res[i].level);

          }
        }
        for (let i = 0; i < this.levels.length; i++) {
          if (this.levels[i].length > 1)
            this.levels[i].sort(function (a, b) {
              return a.position - b.position;
            })
        }
        if (this.instruments.length == 0 || this.levels.length == 0) {
          this.currentInstrument = null;
          this.currentLevel = null;
        }
        this.instrumentIndex = 0;
        this.levelIndex = 0;
        this.currentInstrument = this.instruments[this.instrumentIndex];
        if (this.levels[this.instrumentIndex])
        this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
        this.subscriptions1();
      }
    });


  }
  getPhoto() {
    this.userService.getUser(this.storageService.getCurrentUser().id).subscribe((res) => {
      this.user = res;
      this.setUser();
      if (res.photo_id)
        this.userService.getPhoto(res.photo_id).subscribe((res) => {
          this.imagePreview = res.image.url;
        })
    });
  }

  setDates() {
    this.today = this.calendar.getToday();
    this.startDate = new NgbDate(1990, 1, 1);
  }

  createSettingsForm() {
    this.settingsForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      lastName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      address: [''],
      oldPassword: ['', []],
      newPassword: ['', []],
      confirmPassword: ['', []]
    });
  }

  showDeleteModal() {
      const modal = this.modalService.open(DeleteAccountComponent, {
        windowClass: 'delete-account-modal'
      });
    
      modal.componentInstance.name = 'Delete Account';
  
      modal.result.then(result => {
        if (result === 'yes') {
          modal.close();
          this.storageService.clearAll();
          this.router.navigateByUrl('/home');
        }
      }, err => {
      });
  }

  setUser() {
    this.settingsForm.get('firstName').setValue(this.user.first_name);
    this.settingsForm.get('lastName').setValue(this.user.last_name);
    this.settingsForm.get('telephone').setValue(this.user.telephone);
    this.settingsForm.get('dateOfBirth').setValue(this.parserFormatter.parse(this.user.date_of_birth));
    this.settingsForm.get('emailAddress').setValue(this.user.email_address);
    this.settingsForm.get('address').setValue(this.user.address);

    if (this.user.facebook_id)
      this.facebook_id = true;
  }

  get formGroup() {
    return this.settingsForm.controls;
  }

  getAccessibleInstruments() {
    this.settingsPage = false;
    this.userService.getAccessibleInstruments().subscribe(res => {
      this.instruments = res;
      for (let i = 0; i < this.instruments.length; i++) {
        this.nodeService.getPhoto(this.instruments[i].photo_id).subscribe((res) => {
          this.instruments[i].photo = res.image.url;
        }, err => {
          console.log("This instrument does not have any photo");
        });
      }
      if (this.instruments.length == 0) {
        this.userService.getPendingLicence().subscribe(res => {
          if (res.length == 0) {
            this.router.navigateByUrl('/instruments-info');
          } else {
            this.settingsPage = true;
            this.userService.getPendingInstruments().subscribe(res => {
              this.instruments = res;
              for (let i = 0; i < this.instruments.length; i++) {
                this.nodeService.getPhoto(this.instruments[i].photo_id).subscribe((res) => {
                  this.instruments[i].photo = res.image.url;
                }, err => {
                  console.log("This instrument does not have any photo");
                });
              }
              this.instrumentIndex = 0;
              this.currentInstrument = this.instruments[this.instrumentIndex];
              this.getPendingLevelInfo();
            });
          }
        })
      } else {
        this.settingsPage = true;
        this.instrumentIndex = 0;
        this.currentInstrument = this.instruments[this.instrumentIndex];
        this.getAccessibleLevelInfo();
      }
    });
  }

  getPendingLevelInfo() {
    this.userId = this.storageService.getCurrentUser().id;
    this.userService.getUser(this.userId).subscribe(res => {
      this.user = res;
      this.userService.getPendingLevels(this.instruments[this.instrumentIndex].id).subscribe(res => {
        this.levels = _.sortBy(res, (i) => {
          return parseInt(i.name);
        });
        this.levelIndex = 0;
        if (this.levels.length == 0) return;
        this.currentLevel = this.levels[this.levelIndex];
      });
    });
  }

  getAccessibleLevelInfo() {
    this.userId = this.storageService.getCurrentUser().id;
    this.userService.getUser(this.userId).subscribe(res => {
      this.user = res;
      this.userService.getAccessibleLevels(this.instruments[this.instrumentIndex].id).subscribe(res => {
        this.levelIndex = 0;
        this.levels = _.sortBy(res, (i) => {
          return parseInt(i.name);
        });
        if (this.levels.length == 0) return;
        this.currentLevel = this.levels[this.levelIndex];
      });
    });
  }

  ngOnInit() {
    this.getLicences();
    this.createSettingsForm();
    this.setDates();
    this.getContent();
    this.getPhoto();
  }

  ngOnDestroy() {
    if (this.subscriptions)
      this.subscriptions.unsubscribe();
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  passwordForm(): boolean {
    if (this.settingsForm.get('oldPassword').value === '' && this.settingsForm.get('newPassword').value === '' && this.settingsForm.get('confirmPassword').value === '') {
      return true;
    }
    if (this.settingsForm.get('oldPassword').value.length >= 8 && this.settingsForm.get('newPassword').value.length >= 8 && this.settingsForm.get('confirmPassword').value.length >= 8) {
      return true;
    }
    this.message = 'Passwords must contain at least 8 characters or leave blank';
    return false;
  }

  getSettingsFormGroup() {
    return {
      first_name: this.settingsForm.get('firstName').value,
      email_address: this.settingsForm.get('emailAddress').value,
      last_name: this.settingsForm.get('lastName').value,
      date_of_birth: this.parserFormatter.format(this.settingsForm.get('dateOfBirth').value),
      telephone: this.settingsForm.get('telephone').value,
      address: this.settingsForm.get('address').value
    }
  }

  getPaswords() {
    return {
      password_digest: this.settingsForm.get('oldPassword').value,
      password_confirmation: this.settingsForm.get('confirmPassword').value
    }
  }

  changeUser() {
    this.submitted = true;
    if (this.settingsForm.valid && this.passwordForm()) {
      this.userService.updateUser(this.storageService.getCurrentUser().id, this.getSettingsFormGroup()).subscribe((res) => {
        if (this.settingsForm.get('oldPassword').value.length >= 8 && this.settingsForm.get('newPassword').value.length >= 8 && this.settingsForm.get('confirmPassword').value.length >= 8) {
          if (this.settingsForm.get('confirmPassword').value === this.settingsForm.get('newPassword').value) {
            if (this.user.facebook_id) {

            }
            else {
              this.userService.loginWithUsername(this.user.username, this.settingsForm.get('oldPassword').value).subscribe(res => {
                this.storageService.saveUserData(res);
                this.storageService.setToken(res.authorization.token);
                this.userService.changePassword(this.storageService.getCurrentUser().id, this.getPaswords()).subscribe((res) => {
                  this.router.navigateByUrl('/profile');
                }, err => {
                  if (err.message)
                    this.message = err.message.substring(19);
                });
              }, err => {
                this.message = 'Incorrect old password';
                return;
              });
            }
          }
          else {
            this.message = 'New password and confirm password are not equal';
          }
        }
        else {
          this.router.navigateByUrl('/profile');
        }
      });
    }

  }
}
