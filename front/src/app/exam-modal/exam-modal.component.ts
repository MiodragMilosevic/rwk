import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { UserService } from '../shared/services/user.service';
import * as jquery from 'jquery';

@Component({
  selector: 'app-exam-modal',
  templateUrl: './exam-modal.component.html',
  styleUrls: ['./exam-modal.component.scss']
})
export class ExamModalComponent implements OnInit {

  approvedInstrument: any;
  approvedLevel: any;
  currentInstrument: any;
  currentLevel: any;
  instrumentIndex: any;
  levelIndex: any;
  center: any;
  user: any;
  load: any = false;
  check: any = false;
  check1: any = false;

  constructor(public activeModal: NgbActiveModal, private storageService: StorageService, private userService: UserService) {
    window.scrollTo(0, 0);
    if (this.storageService.getToken()) {
      this.getApprovedLicence();
      this.user = this.storageService.getCurrentUser();
    }
  }

  changeInstrument(i) {
    this.check = false;
    this.instrumentIndex = i;
    this.currentInstrument = this.approvedInstrument[this.instrumentIndex];
    this.levelIndex = 0;
    this.currentLevel = this.approvedLevel[this.instrumentIndex][this.levelIndex];
  }

  changeLevel(i) {
    this.check1 = false;
    this.levelIndex = i;
    this.currentLevel = this.approvedLevel[this.instrumentIndex][this.levelIndex];
  }

  ngOnInit() {
    
  }

  getApprovedLicence() {
    this.approvedInstrument = [];
    this.approvedLevel = [];
    this.userService.getLicences(this.storageService.getCurrentUser().id, 'approved').subscribe(res => {
      if (res.length == 0) {
        this.approvedInstrument = [];
        this.approvedLevel = [];
      } else {
        this.approvedInstrument = new Array();
        this.approvedLevel = new Array();

        for (let i = 0; i < res.length; i++) {
          let startDate = new Date(res[i].start_date);
          let endDate = new Date(res[i].end_date);
          if (startDate.getTime() <= Date.now() && endDate.getTime() >= Date.now()) {
            if (!this.approvedInstrument.some((item) => item.id == res[i].instrument.id)) this.approvedInstrument.push(res[i].instrument);
            let index = this.approvedInstrument.findIndex(record => record.id == res[i].instrument.id);
            if (this.approvedLevel[index] == null) this.approvedLevel[index] = new Array();
            this.approvedLevel[index].push(res[i].level);

          }
        }
        for (let i = 0; i < this.approvedLevel.length; i++) {
          if (this.approvedLevel[i].length > 1)
            this.approvedLevel[i].sort(function (a, b) {
              return a.position - b.position;
            })
        }
        if (this.approvedInstrument.length == 0 || this.approvedLevel.length == 0) {
          this.approvedInstrument = [];
          this.approvedLevel = [];
        }
        this.instrumentIndex = 0;
        this.levelIndex = 0;
        this.currentInstrument = this.approvedInstrument[this.instrumentIndex];
        this.currentLevel = this.approvedLevel[this.instrumentIndex][this.levelIndex];
        this.load = true;
      }
    });
  }
}
