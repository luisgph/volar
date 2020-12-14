import { Component } from '@angular/core';
import * as jQuery from 'jquery';

declare global {
  interface Window {
    parentIFrame:any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'VolarisAdmin';
}
