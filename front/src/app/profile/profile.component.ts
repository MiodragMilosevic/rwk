import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { PageService } from '../shared/services/page.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NodeService } from '../shared/services/node.service';
import { DatePipe } from '@angular/common';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { environment } from 'src/environments/environment';
import { DisclaimerComponent } from '../disclaimer/disclaimer.component';
import * as _ from 'lodash';
import { InstrumentService } from '../shared/services/utility/instrument.service';
import { LevelService } from '../shared/services/utility/level.service';
import { LevelsComponent } from '../levels/levels.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  instruments: Array<any>;
  sections: Array<string>;
  instrumentIndex: number;
  levelIndex: number;
  categoryIndex: number;
  sectionIndex: number;
  levels: Array<Array<any>>;
  categories: Array<any>;
  user: any = null;
  subscriptions = { params: null };
  userId: number;
  studies: Array<any>;
  levelContent: any;
  studiesContent: Array<any> = new Array();
  pageContent: any;
  currentInstrument: any;
  currentLevel: any;
  chooseInstrument: boolean = false;
  instrumentHovered: boolean = false;
  chooseLevel: boolean = false;
  levelHovered: boolean = false;
  sectionStudies: Array<any> = new Array(4);
  listView: boolean = true;
  pdfSrc: string;
  pending: boolean = true;
  numberOfChecks: number = 0;
  imagePreview: any;
  image: any;
  profilePage: boolean = false;
    loadingPdf = false;
  constructor(private router: Router, private datePipe: DatePipe, private userService: UserService, private nodeService: NodeService,
    private activatedRoute: ActivatedRoute, private pageService: PageService, private modalService: NgbModal, private storageService: StorageService, 
    private instrumentService: InstrumentService, private levelService: LevelService) {
    this.getLicences();
    window.scrollTo(0, 0);
  }

  getUser() {
    this.userService.getUser(this.storageService.getCurrentUser().id).subscribe((user) => {
      this.user = user;
      if (!user.disclaimer) {
        this.disclaimer();
      }
      if (user.photo_id)
        this.userService.getPhoto(user.photo_id).subscribe((photo) => {
          this.imagePreview = photo.image.url;
          
        }, err => {
             console.log("Error");
        });
    }, err => {
      this.storageService.clearAll();
      this.router.navigateByUrl('/home');
    });

  }

  getLicences() {
    this.profilePage = false;
    this.userService.getLicences(this.storageService.getCurrentUser().id, 'approved').subscribe(res => {
      if (res.length == 0){
        this.userService.getLicences(this.storageService.getCurrentUser().id, 'pending').subscribe(res => {
          if (res.length == 0){
            this.router.navigateByUrl('/instruments-info');
          } else {
            this.pending = true;
            this.instruments = new Array();
            this.levels = new Array();
            for (let i = 0; i < res.length; i++){
            let startDate = new Date(res[i].start_date);
            let endDate = new Date(res[i].end_date);
            if (startDate.getTime() <= Date.now() && endDate.getTime() >= Date.now()){
              if (!this.instruments.some((item)=> item.id == res[i].instrument.id)) this.instruments.push(res[i].instrument);
              let index = this.instruments.findIndex(record => record.id == res[i].instrument.id);
              if (this.levels[index] == null) this.levels[index] = new Array();
              this.levels[index].push(res[i].level);
            }
          }
          for (let i = 0; i < this.levels.length; i++){
            if (this.levels[i].length > 1)
            this.levels[i].sort(function (a, b) {
              return a.position - b.position;
            })
          }
          if (this.instruments.length == 0 || this.levels.length == 0){
            this.router.navigateByUrl('/instruments-info');
          }
          this.profilePage = true;
          this.getUser();
          setTimeout(this.checkApprovedLicence.bind(this), 3000);
          this.instrumentIndex = 0;
          this.levelIndex = 0;
          this.instrumentService.sendMessage(this.instrumentIndex);
          this.levelService.sendMessage(0);
          this.currentInstrument = this.instruments[this.instrumentIndex];
          if (this.levels && this.levels[this.instrumentIndex])
          if (this.levels[this.instrumentIndex])
          this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
          this.getCategoriesAndStudies();
          }
        });
      } else {
        this.instruments = new Array();
        this.levels = new Array();
        for (let i = 0; i < res.length; i++){
          let startDate = new Date(res[i].start_date);
          let endDate = new Date(res[i].end_date);
          if (startDate.getTime() <= Date.now() && endDate.getTime() >= Date.now()){
            if (!this.instruments.some((item)=> item.id == res[i].instrument.id)) this.instruments.push(res[i].instrument);
            let index = this.instruments.findIndex(record => record.id == res[i].instrument.id);
            if (this.levels[index] == null) this.levels[index] = new Array()
            
            this.levels[index].push(res[i].level);

          }
        }
        for (let i = 0; i < this.levels.length; i++){
          if (this.levels[i].length > 1)
          this.levels[i].sort(function (a, b) {
            return a.position - b.position;
          })
        }
        console.log(this.levels);
        if (this.instruments.length == 0 || this.levels.length == 0){
          this.router.navigateByUrl('/instruments-info');
        }
        this.profilePage = true;
        this.getUser();
        this.pending = false;
        this.instrumentIndex = 0;
        this.levelIndex = 0;
        this.instrumentService.sendMessage(this.instrumentIndex);
        this.levelService.sendMessage(0);
        this.currentInstrument = this.instruments[this.instrumentIndex];
        if (this.levels[this.instrumentIndex])
        this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
        this.getCategoriesAndStudies();
      }
      });
        
        
      }



  checkApprovedLicence() {
    this.numberOfChecks++;
    let user = this.storageService.getCurrentUser();
    if (user == null) return;
    this.userService.getLicences(this.storageService.getCurrentUser().id, 'approved').subscribe(res => {
      if (res.length > 0) {
        this.pending = false;
        this.getLicences();
      } else if (this.numberOfChecks < 60) {
        setTimeout(this.checkApprovedLicence.bind(this), 3000);
      }
    });
  }

  ngOnInit() {
    this.getContent();
  }

  disclaimer() {
    const modal = this.modalService.open(DisclaimerComponent, {
      windowClass: 'disclaimer-modal',
      backdrop: 'static',
      keyboard: false
    });
  
    modal.componentInstance.name = 'Disclaimer';

    modal.result.then(result => {
      if (result === 'yes') {
        modal.close();
        this.userService.setDisclaimer(this.storageService.getCurrentUser().id, true).subscribe((res) => {
        });
      }
    }, err => {
    });
  }

  setGridView() {
    this.listView = false;
  }

  setPdfSrc(url, content) {
    this.loadingPdf = true;
    this.pdfSrc = url;
    this.modalService.open(content, { size: 'lg', windowClass: 'modal-height' });
  }

  setListView() {
    this.listView = true;
  }

  hoverInstrument() {
    this.instrumentHovered = true;
  }

  unhoverInstrument() {
    this.instrumentHovered = false;
    if (this.instruments.length == 1)
      this.chooseInstrument = false;
  }

  hoverLevel() {
    this.levelHovered = true;
    if (this.levels[this.instrumentIndex].length == 1)
      this.chooseLevel = false;
  }

  unhoverLevel() {
    this.levelHovered = false;
  }

  changeLevel(index) {
    this.levelService.sendMessage(index);
    console.log(index);
    this.levelIndex = index;
    if (this.levels[this.instrumentIndex])
    this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
    this.categories = null;
    this.userService.getCategories(this.levels[this.instrumentIndex][this.levelIndex].id).subscribe(res => {
      this.categories = res;
      this.categories.forEach((category)=>{
        let words = category.name.split(' ');
        let name = '';
        words.forEach((word, index) => {
          word = word.toLowerCase();
          if (index === 0 || word === 'solfedgio' || word === 'solfeggio' || word === 'theory'){
            word = word.charAt(0).toUpperCase() + word.slice(1);
          }
          name += word;
          if (index !== words.length - 1) name += ' ';
        });
        category.name = name;
     })
      this.categoryIndex = 0;
    });

    this.toggleChooseLevel();
  }

  changeInstrument(index) {
    this.instrumentIndex = index;
    this.levelIndex = 0;
    this.instrumentService.sendMessage(this.instrumentIndex);
    this.currentInstrument = this.instruments[index];
    if (this.levels[this.instrumentIndex])
    this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
    this.toggleChooseInstrument();
    
    this.getCategoriesAndStudies();


  }

  toggleChooseInstrument() {
    this.chooseInstrument = !this.chooseInstrument;
  }

  toggleChooseLevel() {
    this.chooseLevel = !this.chooseLevel;
  }

  getContent() {
    this.pageService.getContent("profile").subscribe(res => {
      this.pageContent = res[0].content;
      this.initSections();
    }, err => {
      console.log("This page does not have any content");
    })
  }

  initSections() {
    this.sectionIndex = 0;
    this.sections = new Array();
    //this.sections.push(this.pageContent.recommended);
    //this.sections.push(this.pageContent.recently_added);
    this.sections.push(this.pageContent.all_lessons);
    //this.sections.push(this.pageContent.saved);
  }

  changeSection(index) {
    this.sectionIndex = index;
  }

  newStudy(study) {
    let studyDate = new Date(study.updated_at);
    let today = new Date();
    let difference = today.getTime() - studyDate.getTime();
    let weeks = difference / (1000 * 60 * 60 * 24 * 7);
    if (weeks <= 2) return true;
    return false;
  }

  studyDate(study) {
    let studyDate = new Date(study.updated_at);
    return this.datePipe.transform(studyDate, 'mediumDate');

  }

  selectCategory(index) {
    this.categoryIndex = index;
  }

  downloadPdf(study){
     this.nodeService.downloadPdf(study.pdf.url).subscribe(res => {
       console.log(res);
     }, err => {
       console.log(err);
     })
  }

  getCategoriesAndStudies() {
    if (this.levels[this.instrumentIndex])
    this.userService.getCategories(this.levels[this.instrumentIndex][this.levelIndex].id).subscribe(res => {
      this.categoryIndex = 0;
      this.categories = res;
     this.categories.forEach((category)=>{
        let words = category.name.split(' ');
        let name = '';
        words.forEach((word, index) => {
          word = word.toLowerCase();
          if (index === 0 || word === 'solfedgio' || word === 'solfeggio' || word === 'theory'){
            word = word.charAt(0).toUpperCase() + word.slice(1);
          }
          name += word;
          if (index !== words.length - 1) name += ' ';
        });
        category.name = name;
     })
    });
  }

  imageUpload() {
    document.getElementById('inputImageUpload').click();
  }

  fileChangeEvent(event: any) {
    this.image = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {

      this.imagePreview = reader.result;
      const x = new Image();
      x.src = reader.result as string;
      x.onload = () => {
        console.log(x.width + ' ' + x.height);
      }
    }
    if (this.image)
    reader.readAsDataURL(this.image);

    this.userService.createImage(this.image).subscribe((photo) => {

      this.userService.uploadImage(this.storageService.getCurrentUser().id, photo.id).subscribe(() => {
        
      });

    });
  }

}
