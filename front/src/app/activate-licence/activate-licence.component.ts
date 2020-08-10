import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PageService } from '../shared/services/page.service';
import { LicenceService } from '../shared/services/licence.service';

@Component({
  selector: 'app-activate-licence',
  templateUrl: './activate-licence.component.html',
  styleUrls: ['./activate-licence.component.scss']
})
export class ActivateLicenceComponent implements OnInit {

  licenceCodeForm: FormGroup;
  submitted: boolean = false;
  content: any;
  error: any;
  errorDisplay: any = false;
  disabled: any = false;

  constructor(public activeModal: NgbActiveModal, 
    private formBuilder: FormBuilder, private router: Router,
    private pageService: PageService, private licenceService: LicenceService) {
    this.createLicenceCodeForm();
  }

  ngOnInit() {
    this.getContent();
  }

  getContent() {
    this.pageService.getContent("active_licence_modal").subscribe(res => {
      this.content = res[0].content;
    }, err => {
      console.log("Content of this page is not found");
    })
  }

  get formGroup() {
    return this.licenceCodeForm.controls;
  }

  createLicenceCodeForm() {
    this.licenceCodeForm = this.formBuilder.group({
      code: ['', [Validators.required]]
    });
  }

  activate() {
    this.submitted = true;
    if (!this.licenceCodeForm.valid) return;
    this.disabled = true;
   
    this.licenceService.activateLicence(this.licenceCodeForm.get('code').value).subscribe(res => {
        this.disabled = false; 
        this.activeModal.dismiss('Close clicked');
        this.router.navigateByUrl("/profile");
    }, err => {
        console.log(err);
        this.error = "Licence is already activate or not exist";
        this.errorDisplay = true;
        this.disabled = false;
    });
    
  }
}
