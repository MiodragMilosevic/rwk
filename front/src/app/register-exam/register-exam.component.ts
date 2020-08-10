import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CentreService } from '../centre.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { PageService } from '../shared/services/page.service';
import { UserService } from '../shared/services/user.service';
import { InstrumentService } from '../shared/services/utility/instrument.service';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { LevelService } from '../shared/services/utility/level.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExamModalComponent } from '../exam-modal/exam-modal.component';

declare var google;

@Component({
  selector: 'app-register-exam',
  templateUrl: './register-exam.component.html',
  styleUrls: ['./register-exam.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterExamComponent implements OnInit {
  countryName: string;
  selectedCountry: any;
  center: string;
  centres = new Array();
  subscriptions = { params: null };
  content: any;
  load: boolean = false;
  haveInstrument: boolean = false;
  currentLevel: any;
  currentInstrument: any;
  instruments: Array<any>;
  levels: Array<any>;
  instrumentIndex: any;
  levelIndex: any;
  subscriptionInstrument: any;
  subscriptionLevel: any;
  approvedInstrument: Array<any>;
  approvedLevel: Array<any>;

  constructor(private activatedRoute: ActivatedRoute, private centreService: CentreService,
    private pageService: PageService, private userService: UserService, private storageService: StorageService, private router: Router,
    private instrumentService: InstrumentService, private levelService: LevelService,  private modalService: NgbModal) {
    window.scrollTo(0, 0);
    if (this.storageService.getToken()) {
      this.getLicences();
      this.getApprovedLicence();
    }
  }

  getContent() {

    this.subscriptions.params = this.activatedRoute.params.subscribe(
      params => {
        this.countryName = params['country'];

        this.centreService.getCountry(this.countryName).subscribe(res => {
          if (res != null && res.length > 0) {
            this.selectedCountry = res[0];
            this.centres = res[0].centres;
          }
        });
        this.pageService.getContent("register_exam").subscribe(res => {
          this.content = res[0].content;
          this.load = true;
          google.load('visualization', '1', { 'packages': ['geochart'], 'mapsApiKey': 'AIzaSyDU9kmYBPwPoxiT3ZFH3okupN3BcZM9q5k' });
          google.setOnLoadCallback(drawVisualization.bind(this));

          function drawVisualization() {
            var data = google.visualization.arrayToDataTable([
              ['Country', 'Value'],

              [this.countryName, 0]

            ]);
            var options = {
              backgroundColor: { fill: '#FFFFFF', stroke: '#FFFFFF', strokeWidth: 0 },
              legend: 'none',
              datalessRegionColor: '#E8e8e8',
              displayMode: 'regions',
              enableRegionInteractivity: 'true',
              defaultColor: '#e8e8e8',
              resolution: 'countries',
              region: 'world',
              keepAspectRatio: true,
              width: 300,
              height: 220,
              colorAxis: { minValue: 0, maxValue: 1, colors: ['#2D3591', '#2D3591'] },
              tooltip: { textStyle: { color: '#FFFFFF', fontSize: 22, bold: false, fontName: 'Montserrat' }, trigger: 'none', isHtml: true }
            };
            var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
            chart.draw(data, options);
          }
        }
        );
      });
  }

  onSearchChange(searchValue : string ) {  
    if (searchValue == "") {
      this.centreService.getCountry(this.countryName).subscribe(res => {
        if (res != null && res.length > 0) {
          this.selectedCountry = res[0];
          this.centres = res[0].centres;
        }
      });
    }
  }

  ngOnInit() {
    this.getContent();
  }

  search = (text$: Observable<string>) => 
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 0 ? []
        : this.selectedCountry.centres.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  formatter = (x: { name: string }) => x.name

  setCenter(center) {
    this.centres = new Array();
    this.centres.push(center);
  }

  subscriptions1() {
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
            this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
            this.subscriptions1();
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
        this.subscriptions1();
      }
    });
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
      }
    });
  }

  bookExam(center: any) {
    const modal = this.modalService.open(ExamModalComponent, {
      windowClass: 'exam-modal'
    });
    modal.componentInstance.name = 'Exam';

    (<ExamModalComponent>modal.componentInstance).center = center;
    modal.result.then(result => {
     
    }, err => {
      if (err === 'Register clicked') {
        
      }
    });
  }

}