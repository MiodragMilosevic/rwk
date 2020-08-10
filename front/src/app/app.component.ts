import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'rwk-client-angular';
  jwplayer = environment.jwplayer;
  // <script type="text/javascript" src="https://cdn.jwplayer.com/libraries/Drj8BKIz.js"></script>
  ngOnInit() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jwplayer.com/libraries/'+ this.jwplayer +'.js';
    script.type = 'text/javascript';
    const head = document.getElementsByTagName('head').item(0);
    head.appendChild(script);
    console.log(head);
  }
}
