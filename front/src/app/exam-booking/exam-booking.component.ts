import { Component, OnInit, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FacebookService } from '../shared/services/facebook.service';
import { UserService } from '../shared/services/user.service';
import { NodeService } from '../shared/services/node.service';
import { UtilityService } from '../shared/services/utility/utility.service';
import { Subscription } from 'rxjs';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { PageService } from '../shared/services/page.service';

@Component({
  selector: 'app-exam-booking',
  templateUrl: './exam-booking.component.html',
  styleUrls: ['./exam-booking.component.scss']
})
export class ExamBookingComponent implements OnInit {
  china: any;
  instruments: any;
  subscription : Subscription;
  content: any;

  constructor(private pageService: PageService, private router: Router, private facebookService: FacebookService, private userService: UserService, private nodeService: NodeService
    , private utilityService: UtilityService, private storageService: StorageService, private ngZone: NgZone) { 
    if (environment.china == true) this.china = true;
    else this.china = false;
  }

  ngOnInit() {
    this.userService.getInstruments().subscribe(res => {
      this.instruments = res;
      
    })
    this.subscription = this.utilityService.getMessage().subscribe(() => {
      this.userService.loginWithFacebook().subscribe((data) => {
        this.storageService.saveUserData(data);
        this.storageService.setToken(data.authorization.token);
        this.ngZone.run(() =>  { this.router.navigate(['/profile']); } );
      });
    });
    this.getContent();
  }

  getContent() {
    this.pageService.getContent("exam_booking").subscribe(res => {
      this.content = res[0].content;
    }, err => {
      console.log("Content of this page is not found");
    })
  }

  loginUsernamePage() {
    this.router.navigate(['/login']);
  }

  chooseInstrument(index) {
    this.router.navigateByUrl("/instruments/" + this.instruments[index].name);
  }

  loginViaFacebook() {
    this.facebookService.authenticateViaFacebook();
  }

  registerPage() {
    this.router.navigate(['/register']);
  }

}
