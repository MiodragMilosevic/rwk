import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { PageService } from '../shared/services/page.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivateLicenceComponent } from '../activate-licence/activate-licence.component';
import { StorageService } from '../shared/services/storage-service/storage.service';
import { environment } from 'src/environments/environment';
import { NodeService } from '../shared/services/node.service';

@Component({
  selector: 'app-instrument-info',
  templateUrl: './instrument-info.component.html',
  styleUrls: ['./instrument-info.component.scss']
})
export class InstrumentInfoComponent implements OnInit {

  instrument: any;
  level: any;
  subscriptions = { params: null };
  userId: any;
  user: any;
  instruments: Array<any>;
  instrumentIndex: any;
  content: any;

  constructor(private router: Router, private userService: UserService,
    private activatedRoute: ActivatedRoute, private pageService: PageService,  private modalService: NgbModal, private storageService: StorageService, private nodeService: NodeService) {
      window.scrollTo(0, 0);
  }
  
  instrumentsContent: Array<any> = new Array<any>();

  ngOnInit() {
    this.getInfo();
    this.getContent();
  }

  getContent() {
    this.pageService.getContent("instrument_info").subscribe(res => {

      this.content = res[0].content;
    }, err => {
      console.log("Content of this page is not found");
    })
  }

  getInfo(){
    this.subscriptions.params = this.activatedRoute.params.subscribe(
      params => {
        this.userId = this.storageService.getCurrentUser().id;
        this.userService.getUser(this.userId).subscribe(res => {
          this.user = res;

          this.userService.getInstruments().subscribe(res => {
            this.instruments = res;
          });
        }, err => {
          this.storageService.clearAll();
          this.router.navigateByUrl('/home');
        });
      }
    );
  }

  chooseInstrument(i) {
    this.instrumentIndex = i;
    this.instrument = this.instruments[i];
  }

  continue() {
   this.router.navigateByUrl("instruments/"  + this.instruments[this.instrumentIndex].name + "/levels");
  }

  clickHere() {
    const modal = this.modalService.open(ActivateLicenceComponent, {
      windowClass: "activate-licence-modal"
    });
    modal.componentInstance.name = 'Activate Licence';

    modal.result.then(result => {
    }, err => {

    });
  }

}
