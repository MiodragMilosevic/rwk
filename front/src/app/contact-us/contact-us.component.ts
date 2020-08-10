import { Component, OnInit } from '@angular/core';
import { PageService } from '../shared/services/page.service';
import { UserService } from '../shared/services/user.service';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { Router } from '@angular/router';
import { InstrumentService } from '../shared/services/utility/instrument.service';
import { LevelService } from '../shared/services/utility/level.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  content: any;
  currentLevel: any;
  currentInstrument: any;
  instruments: Array<any>;
  levels: Array<any> = [];
  instrumentIndex: any;
  levelIndex: any;
  subscriptionInstrument: any;
  subscriptionLevel: any;
  constructor(private pageService: PageService, private userService: UserService, private storageService: StorageService, private router: Router,
    private instrumentService: InstrumentService, private levelService: LevelService) { 
    window.scrollTo(0, 0);
    if (this.storageService.getToken()) {
      this.getLicences();
    }
  }


  subscriptions() {
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

  getLicences() {
    this.userService.getLicences(this.storageService.getCurrentUser().id, 'approved').subscribe(res => {
      if (res.length == 0) {
        this.userService.getLicences(this.storageService.getCurrentUser().id, 'pending').subscribe(res => {
          if (res.length == 0) {
            this.currentInstrument = null;
            this.currentLevel = null;
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
            this.subscriptions();
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
        this.subscriptions();
      }
    });
  }
  
  ngOnInit() {
    this.getContent();
  }

  getContent() {
    this.pageService.getContent("contact_us").subscribe(res => {
      this.content = res[0].content;
    }, err => {
      console.log("Content of this page is not found");
    })
  }

}
