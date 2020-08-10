import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { PageService } from '../shared/services/page.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { NodeService } from '../shared/services/node.service';
import { environment } from 'src/environments/environment';
import { LinkService } from '../shared/services/utility/link.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  submitted: boolean = false;
  registerFormGroup: FormGroup;
  startDate;
  today;
  error: boolean = false;
  content;
  instruments: Array<any> = null;
  mark: any = false;
  mark1: any = false;
  termsError: any = false;

  constructor(private formBuilder: FormBuilder, private calendar: NgbCalendar, private parserFormatter: NgbDateParserFormatter, private userService: UserService, private router: Router,
    private pageService: PageService, private config: NgbCarouselConfig, private storageService: StorageService, private nodeService: NodeService, private linkService: LinkService) {
    
    config.interval = 10000;
    config.wrap = true;
    config.keyboard = false
    config.pauseOnHover = false;
    config.showNavigationArrows = false;
    window.scrollTo(0, 0);
  }

  ngOnInit() {
    this.createRegisterFormGroup();
    this.getInstrument();
    this.setDates();
    this.getContent();
  }

  login() {
    this.linkService.sendMessage('loginUsernamePage');
    this.router.navigateByUrl('/home');
  }

  getInstrument() {
    this.userService.getInstruments().subscribe(res => {
      this.instruments = res;
    })
  }

  getContent() {
    this.pageService.getContent("register").subscribe((data) => {
      this.content = data[0].content;
    });
  }

  setDates() {
    this.today = this.calendar.getToday();
    this.startDate = new NgbDate(1990, 1, 1);
  }

  chooseInstrument(index) {
    this.router.navigateByUrl("/instruments/" + this.instruments[index].name);
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

  get formGroup() {
    return this.registerFormGroup.controls;
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

  register() {
    this.error = false;
    this.submitted = true;
    if (!this.mark || !this.mark1) {
        this.termsError = true;
        return;
    }
    this.termsError = false;
    if (this.registerFormGroup.valid) {
      
      this.userService.register(this.getRegisterFormGroup()).subscribe((response) => {
        let userRole: {
          user_id: any,
          role: any
        } = {
          user_id: 0,
          role: "basic"
        };
        userRole.user_id = response.id;

        this.userService.createUserRole(userRole).subscribe((response) => {
          this.userService.loginWithUsername(this.registerFormGroup.controls.username.value, this.registerFormGroup.controls.password.value).subscribe(res => {
            this.storageService.saveUserData(res);
            this.storageService.setToken(res.authorization.token);
            this.router.navigateByUrl("/profile");
          }, err => {
            return;
          })

        })
      }, err => {
        this.error = true;
      });
    }
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

  labelClick() {
    this.mark = !this.mark;
  }

  labelClick1() {
    this.mark1 = !this.mark1;
  }

}
