import { InvoicesComponent } from './invoices/invoices.component';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
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
  public pagetitle: string = 'AM-Invoices';
  public chrome: boolean = true;

  public router!: RouterLink;

  constructor (
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {}

  editChrome(value: boolean) {
    this.chrome = value;
    console.log('chrome is set to ' + this.chrome + ' in app.component');
  }





}
