import { Component, OnInit, Injectable, ViewChildren, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormGroup, FormArray, FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { ApiService } from './api-service.service';
import { Vendor, VendorSearch, InvoiceCheck, InvoiceTransaction} from './datatables/data';


@Input()

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AM-Invoices';
  public vendors: Vendor[];
  public currentVendor: Vendor;
  public transactions: InvoiceTransaction[];
  public vendorTransactions: InvoiceTransaction[];
  public selectedTransactions: InvoiceTransaction[];
  public searchDescriptions: VendorSearch[];
  public selectedSearches: VendorSearch[];
  public checks: InvoiceCheck[];
  
  public searchString: any;
  public searchTerm = null;

  private today = new Date;
  public pageTitle = "Vendors";
  public vendorname;
  public vendoruno;
  public currentuno;
  public vendorsLoaded = false;
  public parametersLoaded = false;

  public datedirection = false;
  public paiddirection = false;
  public amountdirection = false;
  public sortnameASC: boolean;
  public sortByName = true;
  public sortByDate = false;
  public sortByPaid = false;
  public sortByAmount = false;

  public displayTransactions = false;
  public displayVendors = true;
  public displaySearchResults = false;
  public startDisplayResults = false;
  public loadingIndicator = true;

  public transInclude: FormGroup[] = [];
  public searchInclude: FormGroup[] = [];
  public selectTrans = false;
  public modalTotal;

  public threeyears = '2018';
  public fiveyears = '2015'
  public allyears = 'All'
  
  public recordHistory = this.threeyears;
  public historyInYears = 3;
  
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private _route: Router,
    private transactionControls: FormBuilder,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.accessParameters();
   }

  ngDoCheck() {}

  ngAfterContentInit()
  {
    if ( this.vendorsLoaded == false ) {
      this.loadVendorData(); 
    }
  }

  async loadVendorData(): Promise<any> {
    this.apiService.debug = true;
    this.apiService.datatype = 'remote';

    if ( this.vendorsLoaded == false ) {
      this.loadingIndicator = true;
      await this.apiService.getVendor(this.historyInYears).subscribe( vendors => {
        this.vendors = vendors;
        if ( this.startDisplayResults == false ) this.loadingIndicator = false;
        this.vendorsLoaded = true;
        });
    }
    return null;
  }

  //******************************************* */
  //   Maniuplating data
  //******************************************* */

  async displaySearch(): Promise<any> {
    this.pageTitle = 'Search Results: ' + this.searchString;
    this.startDisplayResults = true;
    this.loadingIndicator = true;
    this.sortnameASC = false;
    this.amountdirection = false;
    this.datedirection = true;
    this.searchDescriptions = [];
    this.displaySearchResults = true;
    this.displayVendors = false;
    // if (this.apiService.debug == true) console.log(this.searchString);

    await this.apiService.getVendorTransactionBySearch(this.searchString, this.recordHistory).subscribe( searchReturn => {
      this.searchDescriptions = searchReturn.data;
      for ( let i = 0; i < this.searchDescriptions.length; i++ ) {
        this.searchInclude[i] = this.transactionControls.group({
          vendorinvoicetransactionid: new FormControl,
          vendorname: new FormControl,
          invoicenumber: new FormControl,
          invoiceamount: new FormControl,
          transactionpostdate: new FormControl,
          costcode: new FormControl,
          officelocation: new FormControl,
          narrative: new FormControl,
          update: new FormControl
        });
      }
      this.sortDate('date');
      this.loadingIndicator = false;
      this.startDisplayResults = false;
      // console.log(this.searchDescriptions);

    });


    return;
  }



  async getTransactions(uno: number): Promise<any> {
    this.currentuno = uno;
    this.pageTitle = 'Vendor Transactions';
    this.loadingIndicator = true;
    this.vendorTransactions = [];
    this.displayTransactions = true;
    this.displayVendors = false;
    this.selectTrans = false;
    this.datedirection = true;
    this.sortByDate = true;

    await this.apiService.getInvoiceByUno(uno, 'date', this.historyInYears).toPromise().then( transactions => {
      // if (this.apiService.debug == true) console.log("vendors should be done");
      this.vendorTransactions = transactions;
    })
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
    }
    this.sortTransaction('date');
    this.loadingIndicator = false;

    // console.log(this.vendorTransactions);

    return;
  }

  reloadData() {
    this.loadingIndicator = true;
    if ( this.displayVendors ) {
      this.vendorsLoaded = false;
      this.loadVendorData();
    }
    else if ( this.displayTransactions ) {
      this.getTransactions(this.currentuno);
    }
    else if ( this.displaySearchResults ) {
      this.displaySearch();
    }
    else {
      console.log("Something is wrong reloading data")
    }
  }

  selectSearchedItems(): Promise<any> {
    let tempSearches;
    this.modalTotal = 0;
    this.selectedSearches = [];
    for ( let i = 0; i < this.searchInclude.length; i++ ) {
      if ( this.searchInclude[i].value.update == true ) {
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

  setRecordHistory(num: number): void {
    this.historyInYears = num;
    switch (num) {
      case 3: 
        this.recordHistory = this.threeyears;
        break;
      case 5: 
        this.recordHistory = this.fiveyears;
        break;
      case 0: 
        this.recordHistory = this.allyears;
        break;
    }
    this.reloadData();
  }

  setSearchAll() {
    this.selectTrans = !this.selectTrans;
    for ( let i = 0 ; i < this.searchDescriptions.length; i ++ ) {
      if ( this.selectTrans == true ) {
        this.searchInclude[i].controls.update.setValue(true);
      }
      else {
        this.searchInclude[i].controls.update.setValue(false);
      }
    }
  }

  sortAmount() {
    this.sortByDate = false;
    this.sortByAmount = true;
    this.sortByName = false;
    this.selectedSearches = this.searchDescriptions;
    this.searchDescriptions = [];
    console.log("amountdirection is " + this.amountdirection);

    this.amountdirection = !this.amountdirection;
    if ( this.amountdirection == false ) {
      this.selectedSearches.sort( function(a, b) {
      let key1 = a.invoiceamount;
      let key2 = b.invoiceamount;
        if ( key1 > key2 ) return 1;
        else if ( key1 == key2 ) return 0;
        else return -1;
      })
    }
    else {
      this.selectedSearches.sort( function(a, b) {
        let key1 = a.invoiceamount;
        let key2 = b.invoiceamount;
        if ( key1 > key2 ) return -1;
        else if ( key1 == key2 ) return 0;
        else return 1;
      })
    }
    for ( let i = 0; i < this.selectedSearches.length; i++ ) {
      this.searchDescriptions.push(this.selectedSearches[i]);
    }
  }

  sortDate(sortby: string) {
      
      this.sortByAmount = false;
      this.sortByName = false;
      this.selectedSearches = this.searchDescriptions;
      this.searchDescriptions = [];

      if ( sortby == "date" ) {
        this.sortByDate = true;
        this.sortByPaid = false;
        this.datedirection = !this.datedirection;
        this.paiddirection = false;
        if ( this.datedirection == false ) {
          this.selectedSearches.sort((a, b) => (a.invoicedate  > b.invoicedate ) ? -1 : 1)
        }
        else {
          this.selectedSearches.sort((a, b) => (a.invoicedate  < b.invoicedate ) ? -1 : 1)
        }
      }
      else {
        this.sortByDate = false;
        this.sortByPaid = true;
        this.paiddirection = !this.paiddirection;
        if ( this.paiddirection == false ) {
          this.selectedSearches.sort((a, b) => (a.invoicepaiddate < b.invoicepaiddate) ? -1 : 1)
        }
        else {
          this.selectedSearches.sort((a, b) => (a.invoicepaiddate > b.invoicepaiddate) ? -1 : 1)
        }
      }

    
    for ( let i = 0; i < this.selectedSearches.length; i++ ) {
      this.searchDescriptions.push(this.selectedSearches[i]);
    }
  }

  sortName() {
    this.sortByDate = false;
    this.sortByAmount = false;
    this.sortByName = true;
    this.selectedSearches = this.searchDescriptions;
    this.searchDescriptions = [];

    this.sortnameASC = !this.sortnameASC;
    console.log("sortnameASC is " + this.sortnameASC);
    if ( this.sortnameASC == false ) {
      this.selectedSearches.sort( function(a, b) {
        let key1 = a.vendorname;
        let key2 = b.vendorname;
        if ( key1 > key2 ) return 1;
        else if ( key1 == key2 ) return 0;
        else return -1;
      })
    }
    else {
      this.selectedSearches.sort( function(a, b) {
        let key1 = a.vendorname;
        let key2 = b.vendorname;
        if ( key1 > key2 ) return -1;
        else if ( key1 == key2 ) return 0;
        else return 1;
      })
    }


    for ( let i = 0; i < this.selectedSearches.length; i++ ) {
      this.searchDescriptions.push(this.selectedSearches[i]);
    }
  }

  sortTransaction(sortby: string) {
    this.selectedTransactions = this.vendorTransactions;
    this.vendorTransactions = [];
    if ( sortby == "date" ) {
      this.datedirection = !this.datedirection;
      this.sortByDate = true;
      this.sortByPaid = false;
      this.sortByAmount = false;
      if ( this.datedirection == false ) {
        this.selectedTransactions.sort((a, b) => (a.invoicedate > b.invoicedate) ? -1 : 1)
      }
      else {
        this.selectedTransactions.sort((a, b) => (a.invoicedate < b.invoicedate) ? -1 : 1)
      }
    }
    else if ( sortby == "paid" ) {
      this.paiddirection = !this.paiddirection;
      this.sortByPaid = true;
      this.sortByAmount = false;
      this.sortByDate = false;
      if ( this.paiddirection == false ) {
        this.selectedTransactions.sort((a, b) => (a.invoicepaiddate > b.invoicepaiddate) ? -1 : 1)
      }
      else {
        this.selectedTransactions.sort((a, b) => (a.invoicepaiddate < b.invoicepaiddate) ? -1 : 1)
      }
    }
    else if ( sortby == "amount" ) {
      this.amountdirection = !this.amountdirection;
      this.sortByAmount = true;
      this.sortByDate = false;
      this.sortByPaid = false;
      if ( this.amountdirection == false ) {
        this.selectedTransactions.sort( function(a, b) {
        let key1 = a.invoiceamount;
        let key2 = b.invoiceamount;
          if ( key1 > key2 ) return 1;
          else if ( key1 == key2 ) return 0;
          else return -1;
        })
      }
      else {
        this.selectedTransactions.sort( function(a, b) {
          let key1 = a.invoiceamount;
          let key2 = b.invoiceamount;
          if ( key1 > key2 ) return -1;
          else if ( key1 == key2 ) return 0;
          else return 1;
        })
      }
    }

    for ( let i = 0; i < this.selectedTransactions.length; i++ ) {
      this.vendorTransactions.push(this.selectedTransactions[i]);
    }
    this.selectedTransactions = [];



    return;

  }


  //******************************************* */
  //   Navigation and Parameters
  //******************************************* */

  accessParameters(): void {
    this.route.queryParamMap.subscribe(params => {
      const queryStrings: any = this.route.queryParamMap;
      this.executeQueryParams(queryStrings.source.value).then( results => {
      });
      
    });
  }

  addQueryParams(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    // if (this.apiService.debug == true) console.log(query);
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
    this.addQueryParams({vendors: null, search: null})
    this._route.navigate([''], {
      queryParams: {
      }
    });
  }

  clearFilters() {
    this.searchTerm = null;
    this.searchString = null;
  }

  async executeQueryParams(queryStrings): Promise<any> {
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    // console.log("queries"); console.log(queries);
    for (const q of queries) {
      switch (q[0]) {
        case 'vendors':
          this.searchTerm = q[1];
          if ( this.vendorsLoaded == false ) this.loadVendorData();
          break;
        case 'search':
          this.searchString = q[1];
          this.displaySearch(); 
          break;
        case 'history': 
          this.historyInYears = +q[1];
          this.setRecordHistory(this.historyInYears);
          break;
      }
    }
    return;
  }

  openWindow(content): void {
    this.modalService.open(content, { size: 'lg'});
  }


}
