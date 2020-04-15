import { Component, OnInit, Injectable, ViewChildren, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';

import { ApiService } from './api-service.service';
import { Vendor, InvoiceCheck, InvoiceTransaction} from './datatables/data';
// import  *  as  vendors  from  '../assets/vendor.json';
// import  *  as  invoiceTransaction  from  '/./assets/invoicetransaction.json';
// import  *  as  invoiceCheck  from  './/assets/invoicecheck.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AM-Vendors';
  public vendors: Vendor[];
  public invoiceTransaction: InvoiceTransaction[];
  public invoiceCheck: InvoiceCheck[];

  
  constructor(
    private apiService: ApiService,
    
  ) { this.loadData(); }


  async loadData(): Promise<any> {
    this.apiService.debug = true;
    this.apiService.datatype = 'local';

    this.apiService.getVendor().subscribe( vendors => {
      this.vendors = vendors;
      if (this.apiService.debug == true) console.log(this.vendors);
      this.apiService.getInvoice().toPromise().then( invoiceTransaction => {
        this.invoiceTransaction = invoiceTransaction;
        this.apiService.getCheck().toPromise().then( invoiceCheck => {
          this.invoiceCheck = invoiceCheck;
          
        })
      })
    })
    return this.vendors;
  }


}
