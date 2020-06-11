import { Component, OnInit, Injectable, ViewChildren, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormGroup, FormArray, FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { ApiService } from './api-service.service';
import { Vendor, VendorSearch, InvoiceCheck, InvoiceTransaction} from './datatables/data';
import { CloseScrollStrategy } from '@angular/cdk/overlay';


@Input()

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AM-Vendors';
  public vendors: Vendor[];
  public currentVendor: Vendor;
  public transactions: InvoiceTransaction[];
  public vendorTransactions: InvoiceTransaction[];
  public selectedTransactions: InvoiceTransaction[];
  public searchDescriptions: VendorSearch[];
  public selectedSearches: VendorSearch[];
  public checks: InvoiceCheck[];
  public datedirection = false;
  public sortamount = false;
  public sortByDate = true;
  public searchString: string;

  public searchTerm = null;
  private today = new Date;
  public vendorname;
  public vendoruno;

  public displayTransactions = false;
  public displayVendors = true;
  public displaySearchResults = false;
  public loadingIndicator = true;

  public transInclude: FormGroup[] = [];
  public selectTrans = false;
  public modalTotal;
  // private currentDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private _route: Router,
    private transactionControls: FormBuilder,
    private modalService: NgbModal,
    // private datePipe: DatePipe,

  ) {  }

  ngOnInit() {
    this.loadData();
  }

  async loadData(): Promise<any> {
    this.apiService.debug = true;
    this.apiService.datatype = 'remote';

    this.loadingIndicator = true;
    await this.apiService.getVendor().subscribe( vendors => {
      this.loadingIndicator = true;
      this.vendors = vendors;
      // if (this.apiService.debug == true) console.log(this.vendors);
      // this.apiService.getInvoice().toPromise().then( transactions => {
        // if (this.apiService.debug == true) console.log("vendors should be done");
        // this.transactions = transactions;
        // this.buildTransactions();
        // this.apiService.getCheck().toPromise().then( invoiceCheck => {
        //   this.invoiceCheck = invoiceCheck;

        // })
      // })
      this.loadingIndicator = false;
      });
    this.accessParameters();
    return null;
  }

  //******************************************* */
  //   Maniuplating data
  //******************************************* */

  async displaySearch(): Promise<any> {
    this.loadingIndicator = true;
    this.searchDescriptions = [];
    this.displaySearchResults = true;
    this.displayVendors = false;
    if (this.apiService.debug == true) console.log(this.searchString);

    await this.apiService.getVendorTransactionBySearch(this.searchString).subscribe( searchReturn => {
      this.searchDescriptions = searchReturn.data;
      for ( let i = 0; i < this.searchDescriptions.length; i++ ) {
        this.transInclude[i] = this.transactionControls.group({
          vendorinvoicetransactionid: new FormControl,
          vendorname: new FormControl,
          invoicenumber: new FormControl,
          invoiceamount: new FormControl,
          transactionpostdate: new FormControl,
          costcode: new FormControl,
          narrative: new FormControl,
          update: new FormControl
        });
      }
      this.loadingIndicator = false;
    });

    return;
  }

  async getTransactions(uno: number, sort: string): Promise<any> {
    this.vendorTransactions = [];
    this.displayTransactions = true;
    this.displayVendors = false;
    this.selectTrans = false;
    if ( sort == "date" ) {
      this.datedirection = !this.datedirection;
      this.sortByDate = true;
    }
    if ( sort == "amount" ) {
      this.sortamount = !this.sortamount;
      this.sortByDate = false;
    }

    await this.apiService.getInvoiceByUno(uno, sort).toPromise().then( transactions => {
      // if (this.apiService.debug == true) console.log("vendors should be done");
      this.vendorTransactions = transactions;
    })
    // this.vendorTransactions.sort((a, b) => (a.transactionpostdate < b.transactionpostdate) ? 1 : -1)
    // this.vendorTransactions = await this.transactions.filter( t => {
    //   return t.vendoruno === uno;
    // })
    for ( let i = 0; i < this.vendorTransactions.length; i++ ) {
      this.transInclude[i] = this.transactionControls.group({
        vendortransactionid: new FormControl,
        vendorname: new FormControl,
        lastpayment: new FormControl,
        invoiceamount: new FormControl,
        invoicenumber: new FormControl,
        invoicenarrative: new FormControl,
        update: new FormControl
      });
      // this.transInclude[i].controls.update.setValue("true");
    }

    if ( this.apiService.debug ) {
      // console.log("in getTransactions()")
      // console.log(this.vendorTransactions);
      // console.log(this.transInclude);
    }
    return;
  }

  selectSearchedItems(): Promise<any> {
    let tempSearches;
    this.modalTotal = 0;
    this.selectedSearches = [];
    for ( let i = 0; i < this.transInclude.length; i++ ) {
      if ( this.transInclude[i].value.update == true ) {
        this.selectedSearches.push(this.searchDescriptions[i]);
        if ( this.searchDescriptions[i].invoiceamount ) {
          this.modalTotal = this.modalTotal + this.searchDescriptions[i].invoiceamount;
        }
        else {
          console.log("no transaction amount");
          console.log(this.searchDescriptions[i]);
        }
      }
    }
    // console.log(this.modalTotal);
    tempSearches = this.selectedSearches;
    return tempSearches;
  }

  selectTransactions(): Promise<any> {
    let tempTransactions;
    this.modalTotal = 0;
    this.selectedTransactions = [];
    for ( let i = 0; i < this.transInclude.length; i++ ) {
      if ( this.transInclude[i].value.update == true ) {
        this.selectedTransactions.push(this.vendorTransactions[i]);
        if ( this.vendorTransactions[i].invoiceamount ) {
          this.modalTotal = this.modalTotal + this.vendorTransactions[i].invoiceamount;
        }
        else {
          console.log("no transaction amount");
          console.log(this.vendorTransactions[i]);
        }
      }
    }
    // console.log(this.modalTotal);
    tempTransactions = this.selectedTransactions;
    return tempTransactions;
  }

  setAll() {
    this.selectTrans = !this.selectTrans;
    for ( let i = 0 ; i < this.vendorTransactions.length; i ++ ) {
      if ( this.selectTrans == true ) {
        this.transInclude[i].controls.update.setValue(true);
      }
      else {
        this.transInclude[i].controls.update.setValue(false);
      }
    }
  }

  sortDate() {
    this.datedirection = !this.datedirection;
    if ( this.datedirection == false ) {
      this.vendorTransactions.sort((a, b) => (a.transactionpostdate > b.transactionpostdate) ? 1 : -1)
    }
    else {
      this.vendorTransactions.sort((a, b) => (a.transactionpostdate < b.transactionpostdate) ? 1 : -1)
    }

  }


  //******************************************* */
  //   Navigation and Parameters
  //******************************************* */

  accessParameters() {
    // if (this.apiService.debug == true) console.log("in accessParameters()");
    this.route.queryParamMap.subscribe(params => {
      const queryStrings: any = this.route.queryParamMap;
      // if (this.apiService.debug == true) console.log(queryStrings.source.value);
      this.executeQueryParams(queryStrings.source.value);
    });
  }

  addQueryParams(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    if (this.apiService.debug == true) console.log(query);
    if (query === "") {
      query = null;
    }
    this._route.navigate([''], {
      queryParams: {
        ...query
      },
      queryParamsHandling: 'merge',
    });
  }

  clearQueryParams(): void {
    this.clearFilters();
    this._route.navigate([''], {
      queryParams: {
      }
    });
  }

  clearFilters() {
    this.searchTerm = null;
    this.searchString = null;
  }

  executeQueryParams(queryStrings): void {
    // if (this.apiService.debug == true) console.log(queryStrings);
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    for (const q of queries) {
      switch (q[0]) {
        case 'search':
          this.searchTerm = q[1];
          break;
      }
    }
  }

  openWindow(content): void {
    this.modalService.open(content, { size: 'lg'});
  }


}
