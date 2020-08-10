import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { UserService } from '../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as jquery from 'jquery';
import { VideoService } from '../shared/services/video.service';
import { PageService } from '../shared/services/page.service';
import { InstrumentService } from '../shared/services/utility/instrument.service';
import { LevelService } from '../shared/services/utility/level.service';
import { environment } from 'src/environments/environment';
import { Globals } from '../global';

@Component({
  selector: 'app-list-of-videos',
  templateUrl: './list-of-videos.component.html',
  styleUrls: ['./list-of-videos.component.scss']
})
export class ListOfVideosComponent implements OnInit {

  videos: any[] = [];
  logged: any;
  currentInstrument: any;
  currentLevel: any;
  instruments: Array<any>;
  levels: Array<any> = [];
  user: any;
  instrumentIndex: any;
  levelIndex: any;
  index: number[] = [];
  load = false;
  content: any;
  subscriptionInstrument: any;
  subscriptionLevel: any;
  view: any = false;

  constructor(private modalService: NgbModal,
              private storageService: StorageService,
              private userService: UserService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private videoService: VideoService,
              private pageService: PageService,  private instrumentService: InstrumentService, private levelService: LevelService, private globals: Globals) {
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

  ngOnInit() {
    if (this.storageService.getCurrentUser()) {
      this.logged = true;
      this.getLicences();
    } else { this.logged = false; }
    this.getVideos();
    this.getContent();
  }

  getContent() {
    this.pageService.getContent('list_of_videos').subscribe(res => {
      this.content = res[0].content;
      if (environment.china == true && this.globals.locale == 'zh') this.view = true;
      
    });
   }

  getVideos() {
    this.videoService.getAllVideos().subscribe((res) => {
      this.videos = [];
      for (let i = 0; i < res.length; i++) {
  
        res[i].image = res[i].jwplayer_preview.photo;
  
        if (res[i].jwplayer_original.video == null) {
          this.videos.push(res[i]);
        }
  
        if (i === res.length - 1) {
          this.load = true;
        }
      }
      if (this.videos.length === 0) {
        this.router.navigateByUrl('/profile');
        return;
      }
  
  
      this.activatedRoute.queryParams.subscribe(
        params => {
          if (params.videos) {
            this.index = [];
            for (let i = 0; i < params.videos.length; i++) {
              for (let j = 0; j < this.videos.length; j++) {
                if (this.videos[j].id === Number.parseInt(params.videos[i])) {
                  this.index.push(j);
                  continue;
                }
              }
            }
  
          }
        }
      );
    });
    
  }

  registerModal(i: number) {
    document.body.style.position = 'fixed';
    const modal = this.modalService.open(RegisterModalComponent, {
      windowClass: 'register-modal',
    });
  
    modal.componentInstance.name = 'Register';

    modal.result.then(result => {
      document.body.style.position = 'relative';
      if (result === 'Login clicked') {
        this.loginModal(i);
      } else {
        document.body.style.position = 'relative';
        window.location.reload();
      }

    }, err => {
      document.body.style.position = 'relative';
      if (err === 'Login clicked') {
        this.loginModal(i);
      }
    });
  }

  loginModal(i: number) {
    const modal = this.modalService.open(LoginModalComponent, {
      windowClass: 'login-modal'

    });
    modal.componentInstance.name = 'Login';

    modal.result.then(result => {
      window.location.reload();
    }, err => {
      if (err === 'Register clicked') {
        this.registerModal(i);
      }
    });
  }

  getUser() {
    this.userService.getUser(this.storageService.getCurrentUser().id).subscribe((user) => {
      this.user = user;
    }, err => {
      this.storageService.clearAll();
      this.router.navigateByUrl('/home');
    });

  }

  getLicences() {
    this.userService.getLicences(this.storageService.getCurrentUser().id, 'approved').subscribe(res => {
      if (res.length === 0) {
        this.userService.getLicences(this.storageService.getCurrentUser().id, 'pending').subscribe(res => {
          if (res.length === 0) {
            this.currentInstrument = null;
            this.levels = null;
          } else {
            this.instruments = new Array();
            this.levels = new Array();
            for (let i = 0; i < res.length; i++) {
              const startDate = new Date(res[i].start_date);
              const endDate = new Date(res[i].end_date);
              if (startDate.getTime() <= Date.now() && endDate.getTime() >= Date.now()) {
                if (!this.instruments.some((item) => item.id === res[i].instrument.id)) { this.instruments.push(res[i].instrument); }
                const index = this.instruments.findIndex(record => record.id === res[i].instrument.id);
                if (this.levels[index] == null) { this.levels[index] = new Array(); }
                this.levels[index].push(res[i].level);
              }
            }
            for (let i = 0; i < this.levels.length; i++) {
              if (this.levels[i].length > 1) {
                this.levels[i].sort(function(a, b) {
                  return a.position - b.position;
                });
              }
            }
            if (this.instruments.length === 0 || this.levels.length === 0) {
              this.currentInstrument = null;
              this.levels = null;
            }
            this.getUser();
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
          const startDate = new Date(res[i].start_date);
          const endDate = new Date(res[i].end_date);
          if (startDate.getTime() <= Date.now() && endDate.getTime() >= Date.now()) {
            if (!this.instruments.some((item) => item.id === res[i].instrument.id)) { this.instruments.push(res[i].instrument); }
            const index = this.instruments.findIndex(record => record.id === res[i].instrument.id);
            if (this.levels[index] == null) { this.levels[index] = new Array(); }
            this.levels[index].push(res[i].level);

          }
        }
        for (let i = 0; i < this.levels.length; i++) {
          if (this.levels[i].length > 1) {
            this.levels[i].sort(function(a, b) {
              return a.position - b.position;
            });
          }
        }
        if (this.instruments.length === 0 || this.levels.length === 0) {
          this.currentInstrument = null;
          this.currentLevel = null;
        }
        this.getUser();
        this.instrumentIndex = 0;
        this.levelIndex = 0;
        this.currentInstrument = this.instruments[this.instrumentIndex];
        if (this.levels[this.instrumentIndex])
        this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
        this.subscriptions();
      }
    });
  }

  payVideos() {
    const ind: any[] = [];
    console.log(this.index);
    console.log(this.videos)
    for (let i = 0; i < this.index.length; i++) {
      ind.push(this.videos[this.index[i]].id);
    }
    this.router.navigate(['payment'], { queryParams:
      { videos: ind, stepper: false }, skipLocationChange: true });
  }

  addToChart(i: any) {
    let val;
    if ((val = this.index.find(x => x === i)) >= 0) {
      jquery('#add-to-chart-button-' + i + ' .preview-icon-rose').addClass('preview-icon');
      jquery('#add-to-chart-button-' + i + ' .preview-icon-rose').removeClass('preview-icon-rose');
      jquery('#add-to-chart-button-' + i + ' .preview-icon')[0].src = 'assets/images/shopping.svg';
      jquery('#add-to-chart-button-' + i + ' span')[0].innerHTML = 'Add to chart';
      const ind: number = this.index.indexOf(val);
      if (ind !== -1) {
          this.index.splice(ind, 1);
      }
    } else {
      jquery('#add-to-chart-button-' + i + ' .preview-icon').addClass('preview-icon-rose');
      jquery('#add-to-chart-button-' + i + ' .preview-icon').removeClass('preview-icon');
      jquery('#add-to-chart-button-' + i + ' .preview-icon-rose')[0].src = 'assets/images/rose.svg';
      jquery('#add-to-chart-button-' + i + ' span')[0].innerHTML = 'Added';
      this.index.push(i);
    }
  }

  preview(i: any) {
    const ind = this.videos[i].id;
    this.router.navigate(['watch-video/' + ind]);
  }

}
