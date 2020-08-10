import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { UserService } from '../shared/services/user.service';
import { VideoService } from '../shared/services/video.service';
import * as jquery from 'jquery';
import { Location } from '@angular/common';
import { PageService } from '../shared/services/page.service';
import { InstrumentService } from '../shared/services/utility/instrument.service';
import { LevelService } from '../shared/services/utility/level.service';

declare var jwplayer;

@Component({
  selector: 'app-my-videos',
  templateUrl: './my-videos.component.html',
  styleUrls: ['./my-videos.component.scss']
})
export class MyVideosComponent implements OnInit {

  myVideos: any[] = [];
  allVideos: any[] = [];
  index1: any;
  previewVideo: any = false;
  index: any;
  showMoreAvailableVideos: boolean = false;
  showMoreMyVideos: boolean = false;
  currentInstrument: any;
  levels: Array<any> = [];
  instruments: Array<any>;
  instrumentIndex: any;
  levelIndex: any;
  currentLevel: any;
  logged: boolean;
  content: any;
  user: any;
  load: boolean = false;
  subscriptionInstrument: any;
  subscriptionLevel: any;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private storageService: StorageService,
    private router: Router, private videoService: VideoService, private location: Location,  private instrumentService: InstrumentService, private levelService: LevelService,
    private pageService: PageService) {

    if (storageService.getCurrentUser()) {
      this.getLicences();
      this.logged = true;
    }

    this.videoService.getAllVideos().subscribe(res => {
      this.allVideos = [];
      this.myVideos = [];

      for (let i = 0; i < res.length; i++) {
        if (res[i].jwplayer_original.video != null) {
          res[i].img = res[i].jwplayer_preview.photo;
          this.myVideos.push(res[i]);
        }
        else {
          res[i].img = res[i].jwplayer_preview.photo;
          this.allVideos.push(res[i]);
        }
      }

      if (this.allVideos.length == 0 && this.myVideos.length == 0) {
        this.router.navigateByUrl("/profile");
        return;
      }

      this.load = true;
      this.activatedRoute.queryParams.subscribe(
        params => {

          for (let i = 0; i < this.myVideos.length; i++) {
            if (this.myVideos[i].id == params["video"]) {
              this.index1 = i;
              this.previewVideo = false;
            }
          }
          if (this.myVideos.length != 0) {
            this.index1 = 0;
            this.previewVideo = false;
          }
          else {
            for (let i = 0; i < this.allVideos.length; i++) {
              if (this.allVideos[i].id == params["video"]) {
                this.index1 = i;
                this.previewVideo = true;
              }
            }
          }
          if (this.index1 == undefined) {
            this.index1 = 0;
            this.previewVideo = true;
          }

          setTimeout(() => this.call(), 0);

        }
      );
    });

  }

  call() {
    let player = jwplayer('video');
    player.setup({
      playlist: [{
        "title": (!this.previewVideo) ? this.myVideos[this.index1].name : this.allVideos[this.index1].name,
        "stereomode": 'monoscopic',
        "file": (!this.previewVideo) ? this.myVideos[this.index1].jwplayer_original.video : this.allVideos[this.index1].jwplayer_preview.video
      }],
      'modes': [
        {type: 'html5'},
        {type: 'flash', src: '/jwplayer.swf?logo.hide=true'}
      ]
    });

    player.resize('100%', '600px');

    player.play();
  }

  ngOnInit() {
    this.getContent();
  }

  getContent() {
    this.pageService.getContent("my_videos").subscribe(res => {
      this.content = res[0].content;
    });
  }

  showMore() {
    this.showMoreAvailableVideos = !this.showMoreAvailableVideos;
  }

  showMore1() {
    this.showMoreMyVideos = !this.showMoreMyVideos;
  }

  watch(i: any) {
    jquery('#author')[0].innerHTML = this.myVideos[i].author;
    jquery('#place')[0].innerHTML = this.myVideos[i].place;
    this.location.replaceState("/my-videos?video=" + this.myVideos[i].id);

    let player = jwplayer('video');
    player.setup({
      sources: 
        {
          'primary': 'html5'
        },
      playlist: [{
        "title": this.myVideos[i].name,
        "stereomode": 'monoscopic',
        "file": this.myVideos[i].jwplayer_original.video
      }]
    });

    player.resize('100%', '600px');

  }

  preview(i: any) {
    this.router.navigate(['watch-video/' + this.allVideos[i].id]);
  }

  getUser() {
    this.userService.getUser(this.storageService.getCurrentUser().id).subscribe((user) => {
      this.user = user;
    }, err => {
      this.storageService.clearAll();
      this.router.navigateByUrl('/home');
    });

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
}
