import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable({
  providedIn: 'root'
})


export class AppComponent  implements OnInit {
  public TabIndex = 0;
  public title = new BehaviorSubject(this.apiService.pagetitle);
  public pagetitle;
  public chrome: boolean;

  router: RouterLink;

  constructor (
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.chrome = true;
    this.changePageTitle(this.apiService.pagetitle);
    this.route.queryParamMap.subscribe(params => {
      const queryStrings: any = this.route.queryParamMap;
      this.executeQueryParams(queryStrings.source.value);
    });
  }

  changePageTitle(title: string) {
    this.title.next(title);
    this.pagetitle = this.title.value;
  }

  editChrome(value: boolean) {
    this.chrome = value;
    console.log('chrome is set to ' + this.chrome + ' in app.component');
  }

  executeQueryParams(queryStrings): void {
    const queries = Object.entries(queryStrings);
    for (const q of queries) {
      switch (q[0]) {
        case 'chrome':
          if (q[1] === 'false') {
            this.chrome = false;
            this.apiService.setChrome(false);
            if ( this.apiService.debug ) { console.log('This is chrome in app.component: ' + this.chrome); }
          } else {
            this.chrome = true;
            this.apiService.setChrome(true);
            this.editChrome(this.chrome);
          }
          break;
      }
    }
  }

  setTab(tab: number): void {
    this.selectTab(tab);
  }


  selectTab(tab: number): void {
    this.TabIndex = tab;
  }





}
