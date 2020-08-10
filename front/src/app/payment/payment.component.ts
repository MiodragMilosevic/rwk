import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { PageService } from '../shared/services/page.service';
import { NodeService } from '../shared/services/node.service';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { LicenceService } from '../shared/services/licence.service';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { MomentDateFormatter } from '../shared/services/utility/moment-date-formatter';
import { environment } from 'src/environments/environment';
import { VideoService } from '../shared/services/video.service';
import * as jquery from 'jquery';
import { HostListener } from '@angular/core';
import { Subscription } from "rxjs";
import { InstrumentService } from '../shared/services/utility/instrument.service';
import { LevelService } from '../shared/services/utility/level.service';
import { Globals } from '../global';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

    message: any;
    messageSuccess: any;
    user: any = null;
    subscriptions = { params: null };
    userId: any;
    currentInstrument: any;
    instrumentName: any;
    instrument: any;
    levelNumber: any;
    level: any;
    stepper: any = false;
    content: any;
    paymentSubmitted: boolean = true;
    error: any = '';
    errorDisplay: boolean = false;
    elements: Elements;
    cardNumber: StripeElement;
    cardExpiry: StripeElement;
    cardCvc: StripeElement;
    scroll: any;

    videos: any[] = [];
    index: number[];
    selectedVideos: any[];
    priceOfVideos: any;
    load: boolean = false;
    addMoreText: any = 'Add More';
    loaders = {
        creatingStripe: false,
        gettingVideos: false,
        gettingContents: false,
        gettingInfo: false,
        gettingInstrument: false,
        gettingLevel: false
    }
    
    elementsOptions: ElementsOptions = {
        fonts: [
            {
                cssSrc: "https://fonts.googleapis.com/css?family=Montserrat:400,500,700"
            }
        ]
    }

    stripe: FormGroup;

    dateOfActivate: any;
    dateOfDeactivate: any;
    price: any;


    currentLevel: any;
    currentInstrument1: any;
    instruments: Array<any>;
    levels: Array<any> = [];
    instrumentIndex: any;
    levelIndex: any;
    subscriptionInstrument: any;
    subscriptionLevel: any;

    constructor(private router: Router, private userService: UserService, private activatedRoute: ActivatedRoute, private pageService: PageService, private nodeService: NodeService,
        private storageService: StorageService, private licenceService: LicenceService, private instrumentService: InstrumentService, private levelService: LevelService,
        private stripeService: StripeService, private formBuilder: FormBuilder, private parserFormatter: MomentDateFormatter, private videoService: VideoService, private globals: Globals) {
        var date = new Date();
        console.log(this.levels)
        var ngbDateStruct = { day: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear() };

        this.dateOfActivate = this.parserFormatter.format(ngbDateStruct);

        ngbDateStruct = { day: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear() + 1 };
        this.dateOfDeactivate = this.parserFormatter.format(ngbDateStruct);
        window.scrollTo(0, 0);
        if (this.storageService.getToken()) {
            this.getLicences();
        }

        if (this.globals.locale == 'zh') this.addMoreText = "添加更多";
        else if (this.globals.locale == 'es') this.addMoreText = "Añadir más";
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll($event) {
        if (jquery('.list-of-videos')[0]) {
            if (jquery('.list-of-videos')[0].scrollTop >= 10) this.scroll = true;
            else this.scroll = false;
        }
    }

    subscriptions1() {
        this.subscriptionInstrument = this.instrumentService.getMessage().subscribe(instrumentIndex => {
            this.instrumentIndex = instrumentIndex;
            this.currentInstrument1 = this.instruments[this.instrumentIndex];
            if (this.levels[this.instrumentIndex])
                this.levelIndex = this.levels[this.instrumentIndex][0].name;
        });
        this.subscriptionLevel = this.levelService.getMessage().subscribe(levelIndex => {
            if (this.levels[this.instrumentIndex])
                this.levelIndex = this.levels[this.instrumentIndex][levelIndex].name;
        });
        this.currentInstrument1 = this.instruments[this.instrumentIndex];
        if (this.levels[this.instrumentIndex])
            this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
    }



    getLicences() {
        this.userService.getLicences(this.storageService.getCurrentUser().id, 'approved').subscribe(res => {
            if (res.length == 0) {
                this.userService.getLicences(this.storageService.getCurrentUser().id, 'pending').subscribe(res => {
                    if (res.length == 0) {
                        this.currentInstrument1 = null;
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
                            this.currentInstrument1 = null;
                            this.currentLevel = null;
                        }
                        this.instrumentIndex = 0;
                        this.levelIndex = 0;
                        this.currentInstrument1 = this.instruments[this.instrumentIndex];
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
                    this.currentInstrument1 = null;
                    this.currentLevel = null;
                }
                this.instrumentIndex = 0;
                this.levelIndex = 0;
                this.currentInstrument1 = this.instruments[this.instrumentIndex];
                if (this.levels[this.instrumentIndex])
                    this.currentLevel = this.levels[this.instrumentIndex][this.levelIndex];
                this.subscriptions1();
            }
        });
    }

    ngOnInit() {
        this.createStripe();
        this.getVideos();
        this.getContent();
    }

    isInitLoading() {
        let isLoading = false;
        Object.keys(this.loaders).forEach((key) => {
            if (this.loaders[key]) {
                isLoading = true;
            }
        });
        return isLoading;
    }

    getVideos() {
        this.loaders.gettingVideos = true;
        this.videoService.getAllVideos().subscribe(res => {
            this.videos = res;
            for (let i = 0; i < this.videos.length; i++) {
                this.videos[i].img = res[i].jwplayer_preview.photo;
            }
            this.getInfo();
            this.loaders.gettingVideos = false;
            this.paymentSubmitted = false;

        }, error => {
            this.loaders.gettingVideos = false;
        });

    }


    getContent() {
        this.loaders.gettingContents = true;
        this.pageService.getContent("payment").subscribe(res => {
            this.content = res[0].content;
            this.loaders.gettingContents = false;
        }, err => {
            console.log("Content of this page is not found");
            this.loaders.gettingContents = false;
        })
    }

    getInfo() {
        this.loaders.gettingInfo = true;

        (this.subscriptions.params as Subscription) = this.activatedRoute.params.subscribe(
            params => {
                this.userId = this.storageService.getCurrentUser().id;
                this.userService.getUser(this.userId).subscribe(res => {
                    this.user = res;
                });

                this.activatedRoute.queryParams.subscribe(
                    params1 => {
                        this.instrumentName = params1["instrumentName"];

                        this.stepper = params1["stepper"];

                        if (this.instrumentName) {
                            this.loaders.gettingInstrument = true;
                            this.nodeService.getInstrument(this.instrumentName).subscribe(res => {
                                this.loaders.gettingInstrument = false;
                                this.instrument = res[0];
                                this.levelNumber = params1["levelNumber"];
                                if (this.levelNumber) {
                                    this.loaders.gettingLevel = true;
                                    this.nodeService.getLevel(this.instrument.id).subscribe(res => {
                                        for (let i = 0; i < res.length; i++) {
                                            if (Number.parseInt(res[i].name) == this.levelNumber) {
                                                this.level = res[i];
                                            }
                                        }
                                        this.loaders.gettingLevel = false;
                                    }, error => {
                                        this.loaders.gettingLevel = false;
                                    });
                                }
                            }, error => {
                                this.loaders.gettingInstrument = false;
                            });
                        }
                        else {
                            this.index = params1["videos"];
                            this.selectedVideos = [];
                            this.priceOfVideos = 0;
                            console.log(this.index);
                            console.log(this.videos);
                            for (let i = 0; i < this.index.length; i++) {
                                for (let j = 0; j < this.videos.length; j++) {
                                    if (this.videos[j].id == this.index[i]) {
                                        this.priceOfVideos += this.videos[j].price;
                                        this.selectedVideos.push(this.videos[j]);
                                        this.load = true;
                                        continue;
                                    }
                                }
                            }
                            console.log(this.selectedVideos);
                        }
                    }
                )
                this.loaders.gettingInfo = false;
            }, error => {
                this.loaders.gettingInfo = false;
            });
    }

    returnBack() {
        this.router.navigateByUrl("instruments/" + this.instrumentName + "/levels");
    }

    createStripe() {
        this.loaders.creatingStripe = true;
        this.stripe = this.formBuilder.group({
            holderName: ['', [Validators.required]]
        });
        let text = "", text1 = "", text2 = "";
        if (environment.china == false) {
            if (this.globals.locale == 'es') { text = 'Número de tarjeta'; text1 = 'MM/YY'; text2 = 'CVC'; }
            else { text = 'Card Number'; text1 = 'MM/YY'; text2 = 'CVC'; }
        }
        else {
            if (this.globals.locale == 'zh') { text = '卡号'; text1 = 'MM/YY'; text2 = 'CVC'; }
            else { text = 'Card Number'; text1 = 'MM/YY'; text2 = 'CVC'; }
        }
        this.stripeService.elements(this.elementsOptions)
            .subscribe(elements => {
                this.elements = elements;

                this.cardNumber = this.elements.create('cardNumber', {

                    style: {
                        base: {
                            color: '#838383',
                            fontWeight: 400,
                            fontFamily: '"Montserrat"',
                            fontSize: '15px',
                            '::placeholder': {
                                color: '#838383',
                                fontWeight: 400,
                                fontFamily: 'Montserrat',
                                fontSize: '15px'
                            }
                        }
                    },
                    placeholder: text
                });
                this.cardNumber.mount('#card-number');

                this.cardExpiry = this.elements.create('cardExpiry', {
                    style: {
                        base: {
                            color: '#838383',
                            fontWeight: 400,
                            fontFamily: '"Montserrat", sans-serif',
                            fontSize: '15px',
                            '::placeholder': {
                                color: '#838383',
                                fontWeight: 400,
                                fontFamily: '"Montserrat", sans-serif',
                                fontSize: '15px'
                            }
                        }
                    },
                    placeholder: text1
                });
                this.cardExpiry.mount('#card-expiry');

                this.cardCvc = this.elements.create('cardCvc', {
                    style: {
                        base: {
                            color: '#838383',
                            fontWeight: 400,
                            fontFamily: '"Montserrat", sans-serif',
                            fontSize: '15px',
                            '::placeholder': {
                                color: '#838383',
                                fontWeight: 400,
                                fontFamily: '"Montserrat", sans-serif',
                                fontSize: '15px'
                            }
                        }
                    },
                    placeholder: text2
                });
                this.cardCvc.mount('#card-cvc');
                this.loaders.creatingStripe = false;

            }, error => {
                this.loaders.creatingStripe = false;
            });
    }

    pay() {
        this.paymentSubmitted = true;
        if (!this.stripe.valid) {
            console.log('Please fill all fields');
            this.error = 'Please fill all fields';
            this.errorDisplay = true;
            this.paymentSubmitted = false;
            return;
        }

        if (this.instrument && this.level) {
            this.stripeService
                .createToken(this.cardNumber, { name: this.stripe.get('holderName').value })
                .subscribe(result => {
                    if (result.token) {
                        this.userService.createCustomer(this.userId, result.token.id).subscribe(res => {
                           // console.log(result.token);
                            this.licenceService.createLicence(this.level.id).subscribe(licence => {
                               // console.log(licence);
                                this.licenceService.activateLicence(licence.activation_code).subscribe(res => {
                                  //  console.log(res);
                                    this.router.navigateByUrl("/profile");
                                }, err => {
                                    console.log(err.message);
                                    this.error = err.message;
                                    this.errorDisplay = true;
                                    this.paymentSubmitted = false;
                                });
                            }, err => {
                                console.log(err.message);
                                this.error = err.message;
                                this.errorDisplay = true;
                                this.paymentSubmitted = false;
                            });
                        });
                    } else if (result.error) {
                        console.log(result.error.message);
                        this.error = result.error.message;
                        this.errorDisplay = true;
                        this.paymentSubmitted = false;
                    }
                });
        }
        else {
            this.stripeService
                .createToken(this.cardNumber, { name: this.stripe.get('holderName').value })
                .subscribe(result => {
                    if (result.token) {
                        this.userService.createCustomer(this.userId, result.token.id).subscribe(res => {
                            for (let i = 0; i < this.index.length; i++) {
                                this.videoService.createVideoLicence(this.index[i]).subscribe(licence => {
                                    if (this.index.length - 1 == i) {
                                        this.router.navigateByUrl("/profile");
                                    }
                                }, err => {
                                    console.log(err.message);
                                    this.error = err.message;
                                    this.errorDisplay = true;
                                    this.paymentSubmitted = false;
                                });
                            }
                        });
                    } else if (result.error) {
                        console.log(result.error.message);
                        this.error = result.error.message;
                        this.errorDisplay = true;
                        this.paymentSubmitted = false;
                    }
                });
        }
    }

    back() {
        this.router.navigateByUrl("/videos");
    }

    addMore() {
        this.router.navigate(['videos'], {
            queryParams:
                { videos: this.index }, skipLocationChange: true
        });
    }

}

