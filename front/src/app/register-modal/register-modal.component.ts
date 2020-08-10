import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter, NgbModal, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageService } from '../shared/services/page.service';
import { UserService } from '../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent implements OnInit, OnDestroy {

  registerFormGroup: FormGroup;
  content: any;
  submitted: boolean = false;
  error: boolean = false;
  subscriptions = { params: null };
  today: any;
  startDate: any;
  mark: any = false;
  mark1: any = false;
  termsError: any = false;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private pageService: PageService,
    private userService: UserService, private router: Router, private parserFormatter: NgbDateParserFormatter, 
    private storageService: StorageService, private activatedRoute: ActivatedRoute, private modalService: NgbModal,  private calendar: NgbCalendar) { }

  ngOnInit() {
    this.createRegisterFormGroup();
    this.getContent();
    this.subscriptions.params = this.activatedRoute.params.subscribe();
    this.setDates();
  }

  setDates() {
    this.today = this.calendar.getToday();
    this.startDate = new NgbDate(1900, 1, 1);
  }

  ngOnDestroy() {
    this.subscriptions.params.unsubscribe();
  }

  getContent() {
    this.pageService.getContent("register-modal").subscribe(res => {
      this.content = res[0].content;
    })
  }

  get formGroup() {
    return this.registerFormGroup.controls;
  }

  createRegisterFormGroup() {
    this.registerFormGroup = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telephone: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    },
      {
        validators: this.MustMatched('password', 'confirmPassword')
      }
    );
  }

  MustMatched(passwordName, confirmPasswordName) {
    return (formGroup: FormGroup) => {
      const password = formGroup.controls[passwordName];
      const confirmPassword = formGroup.controls[confirmPasswordName];

      if (confirmPassword.errors && !confirmPassword.errors.mustMatch) {
        return;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mustMatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    }
  }

  getRegisterFormGroup() {
    return {
      first_name: this.registerFormGroup.get('firstName').value,
      email_address: this.registerFormGroup.get('emailAddress').value,
      last_name: this.registerFormGroup.get('lastName').value,
      username: this.registerFormGroup.get('username').value,
      date_of_birth: this.parserFormatter.format(this.registerFormGroup.get('dateOfBirth').value),
      password: this.registerFormGroup.get('password').value,
      telephone: this.registerFormGroup.get('telephone').value
    }
  }

  getUser(response: any) {
    return {
      id: response.id,
      first_name: this.registerFormGroup.get('firstName').value,
      email_address: this.registerFormGroup.get('emailAddress').value,
      last_name: this.registerFormGroup.get('lastName').value,
      username: this.registerFormGroup.get('username').value,
      date_of_birth: this.parserFormatter.format(this.registerFormGroup.get('dateOfBirth').value),
      password: this.registerFormGroup.get('password').value,
      telephone: this.registerFormGroup.get('telephone').value
    }
  }

  register() {
    this.error = false;
    this.submitted = true;
    if (!this.mark || !this.mark1) {
      this.termsError = true;
      return;
    }
    this.termsError = false;
    if (this.registerFormGroup.valid) {
      
      this.userService.register(this.getRegisterFormGroup()).subscribe((user) => {
        let userRole: {
          user_id: any,
          role: any
        } = {
          user_id: 0,
          role: "basic"
        };
        userRole.user_id = user.id;
        this.userService.createUserRole(userRole).subscribe((response) => {
          this.userService.loginWithUsername(user.username, this.registerFormGroup.get('password').value).subscribe(res => {
            this.storageService.saveUserData(res);
            this.storageService.setToken(res.authorization.token);
            this.activeModal.close(this.getUser(response));
          })
        })
      }, err => {
        this.error = true;
      });
    }

  }

  labelClick() {
    this.mark = !this.mark;
  }

  labelClick1() {
    this.mark1 = !this.mark1;
  }

  login() {
    this.activeModal.close('Login clicked');
  }
}

