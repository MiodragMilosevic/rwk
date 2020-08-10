import { Component, OnInit, Injector } from '@angular/core';
import { PageService } from '../shared/services/page.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  content: any;
  bugsnagClient: any;
  
  constructor(private pageService: PageService, private injector: Injector) { 
    this.bugsnagClient = this.injector.get('bugsnagClient');
    this.getContent();
  }

  ngOnInit() {
    
  }

  getContent() {
    this.pageService.getContent("footer").subscribe((data) => {
      this.content = data[0].content;
    }, err =>{
      console.log("Content of this page is not found");
    });
  }

}
