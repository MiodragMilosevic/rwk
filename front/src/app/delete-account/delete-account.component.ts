import { Component, OnInit } from '@angular/core';
import { PageService } from '../shared/services/page.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../shared/services/user.service';
import { StorageService } from '../shared/services/storage-service/storage.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {
  content: any;

  constructor(private pageService: PageService, public activeModal: NgbActiveModal, private userService: UserService, private storageService: StorageService) { }

  ngOnInit() {
    this.getContent();
  }

  getContent() {
    this.pageService.getContent('delete_account').subscribe(res => {
      this.content = res[0].content;
    }, err => {
      console.log('Content of this page is not found');
    });
  }

  cancel() {
    this.activeModal.close('no');
  }

  delete() {
    this.userService.deleteAccount(this.storageService.getCurrentUser().id).subscribe(res => {
      this.activeModal.close('yes');
    }, err => {
      this.activeModal.close('no');
    })
  }

}
