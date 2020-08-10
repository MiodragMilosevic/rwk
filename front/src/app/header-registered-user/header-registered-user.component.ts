import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { PageService } from '../shared/services/page.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { NodeService } from '../shared/services/node.service';
import { environment } from 'src/environments/environment';
import { languages } from '../model/language';
import { Globals } from '../global';

@Component({
  selector: 'app-header-registered-user',
  templateUrl: './header-registered-user.component.html',
  styleUrls: ['./header-registered-user.component.scss']
})
export class HeaderRegisteredUserComponent implements OnInit, OnChanges {
  @Output() update = new EventEmitter<string>();
  subscriptions = { params: null };
  userId: number;
  user: any = null;
  @Input() instrumentData;
  @Input() levelData;
  instrument: any;
  level: any;
  pageContent: any;
  language: any;
  supportLanguage: any = false;
  type: any = 0;
  china: any = false;

  constructor(private activatedRoute: ActivatedRoute, private nodeService: NodeService, private userService: UserService, private pageService: PageService, private storageService: StorageService, private router: Router,
    private globals: Globals) {
    if (environment.baseUrl === 'http://localhost:3000') {
      this.supportLanguage = true;
    }
    else {
      this.supportLanguage = true;
    }

    this.language = languages;

    this.china = environment.china;
    this.type = this.storageService.getType();
    if (this.type == null) {
      this.storageService.setType(1);
      this.type = 1;
      this.globals.locale = 'en';
    } else {
      if (this.type == '0') {
        this.type = 0;
        this.globals.locale = 'zh';
      } else if (this.type == '1') {
          this.type = 1;
          this.globals.locale = 'en';
        }
        else if (this.type == '2') {
          this.type = 2;
          this.globals.locale = 'es';
        }
    }
  }

  setSpain() {
    this.globals.typeOfLanguage = 2;
    this.globals.locale = 'es';
    this.storageService.setType(2);
    window.location.reload();
  }

  setUK() {
    this.globals.typeOfLanguage = 1;
    this.globals.locale = 'en';
    this.storageService.setType(1);
    window.location.reload();
  }

  setChina() {
    this.globals.typeOfLanguage = 0;
    this.globals.locale = 'zh';
    this.storageService.setType(0);
    window.location.reload();
  }

  ngOnInit() {
    this.pageService.getContent("header_registered_user").subscribe(res => {
      this.pageContent = res[0].content;
    }, err => {
      console.log("Content of this page is not found");
    })
    this.subscriptions.params = this.activatedRoute.params.subscribe(
      params => {
        this.userId = this.storageService.getCurrentUser().id;
        this.userService.getUser(this.userId).subscribe(res => {
          this.user = res;
        }, err => {
          this.storageService.clearAll();
          this.router.navigateByUrl('/home');
        })
      }
    )
  }

  ngOnChanges() {
    this.instrument = this.instrumentData;
    this.level = this.levelData;
  }

  logout() {
    this.storageService.clearAll();
    this.router.navigateByUrl("/home");
  }

}

