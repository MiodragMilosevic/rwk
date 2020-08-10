import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as jquery from 'jquery';
import { PageService } from '../shared/services/page.service';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent implements OnInit {

  mark: boolean = false;
  content: any;

  constructor(public activeModal: NgbActiveModal, private pageService: PageService) { }

  ngOnInit() {
    this.getContent();
  }

  labelClick() {
    this.mark = !this.mark;
  }

  buttonClick() {
    if (this.mark) {
       this.activeModal.close('yes');
    }
  }

  getContent() {
    this.pageService.getContent("disclaimer").subscribe(res => {
      this.content = res[0].content;
    }, err => {
      console.log("Content of this page is not found");
    })
  }
}
