import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {Router, ActivatedRoute, ChildActivationEnd} from '@angular/router';
import {PageService} from '../shared/services/page.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StorageService} from '../shared/services/storage-service/storage.service';
import {environment} from 'src/environments/environment';
import * as jquery from 'jquery';
import * as _ from 'lodash';

@Component({
    selector: 'app-levels',
    templateUrl: './levels.component.html',
    styleUrls: ['./levels.component.scss']
})
export class LevelsComponent implements OnInit {
    instruments: Array<any>;
    levels: Array<any>;
    studiesContent: Array<any> = new Array();
    studies: Array<any>;
    categories: Array<any>;
    hoveredLevel: any;
    selectedLevel: any;
    levelIndex: number;
    subscriptions = {params: null};
    instrumentIndex: number;
    instrumentsContent: Array<any> = new Array();
    pageContent: any;
    instrumentName: string;
    pdfSrc: string;
    selectedCategory: number;
    levelContent: any;
    selectedLevelIndex: number = -1;
    selectedInstrument: any;
    select: boolean = false;
    userId;
    activeElement: number = 0;
    loadingPdf = false;

    constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute, private pageService: PageService,
                private modalService: NgbModal, private storageService: StorageService) {
        window.scrollTo(0, 0);
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
                    this.userId = this.storageService.getCurrentUser().id;
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

    ngOnDestroy() {
        this.subscriptions.params.unsubscribe();
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
            this.activeElement = 0;
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
        })
    }

    selectLevel(i) {
        this.select = true;
        this.selectedLevelIndex = i;
        this.selectedLevel = this.levels[i];
        this.getCategoriesAndStudies(this.selectedLevel);
    }


    getContent() {
        this.pageService.getContent("instrument_level").subscribe(res => {
            this.pageContent = res[0].content;
        }, err => {
            console.log("Content of this page is not found");
        })
    }

    chooseInstrument(i) {
        this.router.navigateByUrl('instruments/' + this.instruments[i].name);
    }

    setPdfSrc(url, content) {
        this.loadingPdf = true;
        this.pdfSrc = url;
        this.modalService.open(content, {size: 'lg', windowClass: 'modal-height'});

    }

    changeCategory(i) {
        if (i != this.activeElement) {
            let value = 0;

            if (i >= this.activeElement) {
                for (let j = this.activeElement; j < i; j++) {
                    value += jquery('#navbar-nav li:nth-child(' + (j + 1) + ')').width();
                }
                jquery('#nav-scroll').animate({scrollLeft: '+=' + value + ''}, 300);
            }
            else {
                for (let j = i; j < this.activeElement; j++) {
                    value += jquery('#navbar-nav li:nth-child(' + (j + 1) + ')').width();
                }
                jquery('#nav-scroll').animate({scrollLeft: '-=' + value + ''}, 300);
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
        jquery('#nav-scroll').animate({scrollLeft: '-=' + value + ''}, 300);
    }

    clickRight() {
        let value = 0;
        for (let j = this.activeElement; j < this.activeElement + 1; j++) {
            value += jquery('#navbar-nav li:nth-child(' + (j + 1) + ')').width();
        }

        this.activeElement += 1;
        this.selectedCategory = this.activeElement;
        jquery('#nav-scroll').animate({scrollLeft: '+=' + value + ''}, 300);
    }

    returnBack() {
        this.router.navigateByUrl("/instruments-info");
    }

    checkout() {
        this.router.navigate(['payment'], {
            queryParams:
                {
                    instrumentName: this.instruments[this.instrumentIndex].name,
                    levelNumber: this.selectedLevel.name,
                    stepper: true
                }, skipLocationChange: true
        });
    }

}
