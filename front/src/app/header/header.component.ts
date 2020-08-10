import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { PageService } from '../shared/services/page.service';
import { languages } from '../model/language';
import { environment } from 'src/environments/environment';
import { Globals } from '../global';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {
  @Output() update = new EventEmitter<any>();

  content: any;
  language: any;
  supportLanguage: any = false;
  china: any = false;
  type: any = 0;
  chinese: any = false;
  loggedUser: any = false;
  user: any;
  @Input() instrumentData;
  @Input() levelData;
  instrument: any;
  level: any;
  constructor(private pageService: PageService, private globals: Globals, private storageService: StorageService, private router: Router) { 
    this.china = environment.china;
    this.chinese = environment.china;
    this.type = this.storageService.getType();
    if (this.storageService.getCurrentUser()){
      this.loggedUser = true;
      this.user = this.storageService.getCurrentUser();
    }
    if (this.type == null) {
      if (environment.china == true) {
        this.storageService.setType(0);
        this.type = 0;
        this.globals.locale = 'zh';
      }
      else {
        this.storageService.setType(1);
        this.type = 1;
        this.globals.locale = 'en';
      }
      
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
    this.getContent();
    if (environment.baseUrl === 'http://localhost:3000') {
      this.supportLanguage = true;
    }
    else { 
      this.supportLanguage = true;
    }  
    this.language = languages;
  }

  getContent() {
    this.pageService.getContent("header").subscribe((data) => {
      this.content = data[0].content;
    }, err => {
      console.log("Content of this page is not found");
    });
    
  }

  logout() {
    this.storageService.clearAll();
    if (this.router.url == "/home") 
    {
      window.location.reload();
    }
    else this.router.navigateByUrl("/home");
  }

  ngOnChanges() {    
    this.instrument = this.instrumentData;
    this.level = this.levelData;
  }
}
