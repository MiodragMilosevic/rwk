import { Component, OnInit, Sanitizer } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../shared/services/page.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { environment } from 'src/environments/environment';
import * as jquery from 'jquery';
import { NodeService } from '../shared/services/node.service';
import * as _ from 'lodash';
import { Globals } from '../global';


@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.scss']
})
export class InstrumentsComponent implements OnInit {
  instruments: Array<any>;
  levels: Array<any>;
  studiesContent: Array<any> = new Array();
  studies: Array<any>;
  categories: Array<any>;
  hoveredLevel: any;
  selectedLevel: any;
  levelIndex: number;
  subscriptions = { params: null };
  instrumentIndex: number;
  instrumentsContent: Array<any> = new Array();
  pageContent: any;
  instrumentName: string;
  pdfSrc: string;
  selectedCategory: number;
  levelContent: any;
  selectedLevelIndex: number = -1;
  selectedInstrument: any;
  activeElement: number = 0;
  alreadyHasLevel: boolean = false;
  categoryNav: {
    index: 0
  };
  user: any = false;
    loadingPdf = false;
  note: any;

  constructor(private userService: UserService, private storageService: StorageService, private activatedRoute: ActivatedRoute, private router: Router,
    private pageService: PageService, private modalService: NgbModal, private nodeService: NodeService, private globals: Globals) {
    window.scrollTo(0, 0);
    if (storageService.getCurrentUser())
      this.user = true;

    this.note = "Note: You've already purchased this level";
    if (this.globals.locale == 'zh') {
      this.note = "注意：您已购买此级别";
    }
    else if (this.globals.locale == 'es') {
      this.note = "Nota: ya has comprado este nivel";
    }
  }

  ngOnInit() {
    this.userService.getInstruments().subscribe(res => {
      this.instruments = res;
      this.subscriptions.params = this.activatedRoute.params.subscribe(
        params => {
          this.hoveredLevel = null;
          this.selectedLevel = null;
          this.selectedLevelIndex = -1;
          this.instrumentName = params['instrumentName'];
          for (let i = 0; i < this.instruments.length; i++) {
            if (this.instruments[i].original_name == this.instrumentName) {
              this.instrumentIndex = i;
              this.selectedInstrument = this.instruments[this.instrumentIndex];
              
            }
          }
          this.getLevels();
        }
      );
    });

    this.getContent();
  }

  getLevels() {
    this.userService.getLevels(this.instruments[this.instrumentIndex].id).subscribe(res => {
      this.levels = res;
      this.selectedLevel = null;
    });
  }

  getCategoriesAndStudies(level) {
    this.userService.getCategories(level.id).subscribe(res => {
      this.categories = res;
      this.selectedCategory = 0;
      this.studies = new Array();
      this.studiesContent = new Array();
      if (this.categories.length == 0) return;
      this.categories.forEach((category) => {
        let words = category.name.split(' ');
        let name = '';
        words.forEach((word, index) => {
          word = word.toLowerCase();
          if (index === 0 || word === 'solfedgio' || word === 'solfeggio' || word === 'theory') {
            word = word.charAt(0).toUpperCase() + word.slice(1);
          }
          name += word;
          if (index !== words.length - 1) name += ' ';
        });
        category.name = name;
      });
    });
  }

  selectLevel(i) {
    this.activeElement = 0;
    this.selectedLevelIndex = i;
    this.selectedLevel = this.levels[i];
    this.getCategoriesAndStudies(this.selectedLevel);
    if (this.selectedLevel.content != null)
      this.levelContent = this.selectedLevel.content;
    if (this.user) {
      if (!this.getLicences('approved')) {
        this.getLicences('pending');
      }
    } else {
      this.alreadyHasLevel = false;
    }
  }

  getLicences(status) {
    this.userService.getLicences(this.storageService.getCurrentUser().id, status).subscribe(res => {
      if (res.length == 0) {
        this.alreadyHasLevel = false;
      } else {
        for (let i = 0; i < res.length; i++) {
        let startDate = new Date(res[i].start_date);
        let endDate = new Date(res[i].end_date);
        if (startDate.getTime() <= Date.now() && endDate.getTime() >= Date.now()){
          if (res[i].level && res[i].level.id == this.selectedLevel.id) {
            this.alreadyHasLevel = true;
            return true;
          } else {
            this.alreadyHasLevel = false;
          }
        } else {
          this.alreadyHasLevel = false;
        }
      }
    }
    });
    return false;
  }


  getContent() {
    this.pageService.getContent('instruments').subscribe(res => {
      this.pageContent = res[0].content;
    }, err => {
      console.log('Content of this page is not found');
    });
  }

  chooseInstrument(i) {
    this.router.navigateByUrl('instruments/' + this.instruments[i].name);
  }

  setPdfSrc(url, content) {
      this.loadingPdf = true;
    this.pdfSrc = url;
    this.modalService.open(content, { size: 'lg', windowClass: 'modal-height' });

  }

  registerModal() {
    const modal = this.modalService.open(RegisterModalComponent, {
      windowClass: 'register-modal'
    });
    modal.componentInstance.name = 'Register';

    modal.result.then(result => {
      if (result == 'Login clicked') {
        this.loginModal();
      }
      else
        this.router.navigate(['payment'],{ queryParams:
          { instrumentName: this.instruments[this.instrumentIndex].name , levelNumber:  this.selectedLevel.name, stepper: false }, skipLocationChange:  true  });
    }, err => {
      if (err === 'Login clicked') {
        this.loginModal();
      }
    });
  }

  loginModal() {
    const modal = this.modalService.open(LoginModalComponent, {
      windowClass: 'login-modal'

    });
    modal.componentInstance.name = 'Login';

    modal.result.then(result => {
      this.router.navigate(['payment'],{ queryParams:
        { instrumentName: this.instruments[this.instrumentIndex].name , levelNumber:  this.selectedLevel.name, stepper: false }, skipLocationChange:  true  });
    }, err => {
      if (err === 'Register clicked') {
        this.registerModal();
      }
    });
  }

  changeCategory(i) {
    if (i != this.activeElement) {
      let value = 0;

      if (i >= this.activeElement) {
        for (let j = this.activeElement; j < i; j++) {
          value += jquery('#navbar-nav li:nth-child(' + (j + 1) + ')').width();
        }
        jquery('#nav-scroll').animate({ scrollLeft: '+=' + value + '' }, 300);
      }
      else {
        for (let j = i; j < this.activeElement; j++) {
          value += jquery('#navbar-nav li:nth-child(' + (j + 1) + ')').width();
        }
        jquery('#nav-scroll').animate({ scrollLeft: '-=' + value + '' }, 300);
      }
    }

    this.selectedCategory = i;
    this.activeElement = i;
  }

  clickLeft() {
    this.activeElement -= 1;
    let value = 0;
    for (let j = this.activeElement; j < this.activeElement + 1; j++) {
      value += jquery('#navbar-nav li:nth-child(' + (j + 1) + ')').width();
    }
    this.selectedCategory = this.activeElement;
    jquery('#nav-scroll').animate({ scrollLeft: '-=' + value + '' }, 300);

  }

  clickRight() {
    let value = 0;
    for (let j = this.activeElement; j < this.activeElement + 1; j++) {
      value += jquery('#navbar-nav li:nth-child(' + (j + 1) + ')').width();
    }

    this.activeElement += 1;
    this.selectedCategory = this.activeElement;
    jquery('#nav-scroll').animate({ scrollLeft: '+=' + value + '' }, 300);

  }

  continue() {

    console.log(this.selectedLevel)
    this.router.navigate(['payment'],{ queryParams:
      { instrumentName: this.instruments[this.instrumentIndex].name , levelNumber:  this.selectedLevel.name, stepper: false }, skipLocationChange:  true  });
  }
}

