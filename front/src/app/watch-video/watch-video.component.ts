import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { VideoService } from '../shared/services/video.service';
import * as jquery from 'jquery';
import { Location } from '@angular/common';
import { PageService } from '../shared/services/page.service';
import {environment} from '../../environments/environment';
import { InstrumentService } from '../shared/services/utility/instrument.service';
import { LevelService } from '../shared/services/utility/level.service';
declare var jwplayer;


@Component({
  selector: 'app-watch-video',
  templateUrl: './watch-video.component.html',
  styleUrls: ['./watch-video.component.scss']
})

export class WatchVideoComponent implements OnInit {

  videos: any[] = [];
  videoPurchase: any;
  content: any;
  index1: number;
  user: any;
  currentInstrument: any;
  levels: Array<any> = [];
  instruments: Array<any>;
  instrumentIndex: any;
  levelIndex: any;
  currentLevel: any;
  logged: boolean;
  load = false;
  subscriptionInstrument: any;
  subscriptionLevel: any;
  isChina: boolean;

  autoVideo: any;
  isLoading = false;
  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private storageService: StorageService,
              private router: Router, private videoService: VideoService, private location: Location,
              private pageService: PageService, private instrumentService: InstrumentService, private levelService: LevelService) {
      this.isLoading = true;
      this.isChina = environment.china;

      this.videoService.getAllVideos().subscribe(res => {

        this.videos = [];
        for (let i = 0; i < res.length; i++) {
        if (res[i].jwplayer_original.video == null) {
          res[i].img = res[i].jwplayer_preview.photo;
          this.videos.push(res[i]);
        }
      }
        this.activatedRoute.params.subscribe(
        params => {
          if (params.videos) {
            for (let i = 0; i < this.videos.length; i++) {
              if (this.videos[i].id == Number.parseInt(params.videos)) {
                this.index1 = i;
                console.log(this.videos[this.index1].price.toString().length);
                this.videoPurchase = this.videos[i].id;
              }
            }

          }
        }
      );

        if (this.storageService.getCurrentUser()) {
        this.logged = true;
        this.getLicences();
      } else { this.logged = false; }

        setTimeout(() => this.call(), 0);
        this.isLoading = false;
    }, error => {
        this.isLoading = false;
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


  call() {
    const player = jwplayer('video');

    player.setup({
      playlist: [{
        title:  this.videos[this.index1].name,
        stereomode: 'monoscopic',
        file: this.videos[this.index1].jwplayer_preview.video
      }],
      modes: [
        {type: 'html5'},
        {type: 'flash', src: '/jwplayer.swf?logo.hide=true'}
      ]
    });

    player.resize('100%', '600px');


    player.onComplete(function() {
      jquery(this)[0].play();
      jquery(this)[0].stop();
      jquery('.modal').css('display', 'block');
    });

    player.play();
  }

  back() {
    this.router.navigateByUrl('/videos');
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
      if (res.length == 0) {
        this.userService.getLicences(this.storageService.getCurrentUser().id, 'pending').subscribe(res => {
          if (res.length == 0) {
            this.currentInstrument = null;
            this.levels = null;
          } else {
            this.instruments = new Array();
            this.levels = new Array();
            for (let i = 0; i < res.length; i++) {
              const startDate = new Date(res[i].start_date);
              const endDate = new Date(res[i].end_date);
              if (startDate.getTime() <= Date.now() && endDate.getTime() >= Date.now()) {
                if (!this.instruments.some((item) => item.id == res[i].instrument.id)) { this.instruments.push(res[i].instrument); }
                const index = this.instruments.findIndex(record => record.id == res[i].instrument.id);
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
          const startDate = new Date(res[i].start_date);
          const endDate = new Date(res[i].end_date);
          if (startDate.getTime() <= Date.now() && endDate.getTime() >= Date.now()) {
            if (!this.instruments.some((item) => item.id == res[i].instrument.id)) { this.instruments.push(res[i].instrument); }
            const index = this.instruments.findIndex(record => record.id == res[i].instrument.id);
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

  ngOnInit() {
    this.getContent();
  }

  getContent() {
    this.pageService.getContent('watch_video').subscribe(res => {
      this.content = res[0].content;
    });
   }

  preview(i: any) {
    this.close();
    jquery('#author')[0].innerHTML = this.videos[i].author;
    jquery('#number')[0].innerHTML = this.videos[i].price + '$';
    this.location.replaceState('/watch-video/' + this.videos[i].id);
    this.videoPurchase = this.videos[i].id;
    const player = jwplayer('video');
    player.setup({
      playlist: [{
        title: this.videos[i].name,
        stereomode: 'monoscopic',
        file: this.videos[i].jwplayer_preview.video
      }]
    });

    player.resize('100%', '600px');

    player.onComplete(function() {
      jquery(this)[0].play();
      jquery(this)[0].stop();
      jquery('.modal').css('display', 'block');
    });
    window.scrollTo(0, 0);
  }

  purchaseVideo() {
    const index = [];
    index.push(this.videoPurchase);

    this.router.navigate(['payment'], {
      queryParams:
        { videos: index, stepper: false }, skipLocationChange: true
    });

  }

  close() {
    jquery('.modal').css('display', 'none');
  }

  purchase() {
    const index = [];
    index.push(this.videoPurchase);

    this.router.navigate(['payment'], {
      queryParams:
        { videos: index, stepper: false }, skipLocationChange: true
    });
  }
}
