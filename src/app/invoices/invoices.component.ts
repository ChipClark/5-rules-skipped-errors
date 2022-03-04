import { Component, OnInit, Injectable, ViewChildren, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, FormArray, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from './../api.service';
import { Vendor, InvoiceCheck, InvoiceTransaction} from './../datatables/data';

@Input()

@Component({
  selector: 'app-root',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent {
  title = 'AM-Invoices';
  public vendors: Vendor[] = [];
  public currentVendor: Vendor = new Vendor;
  public transactions: InvoiceTransaction[] = [];
  public vendorTransactions: InvoiceTransaction[] = [];
  public selectedTransactions: InvoiceTransaction[] = [];
  public searchDescriptions: InvoiceTransaction[] = [];
  public selectedSearches: InvoiceTransaction[] = [];
  public checks: InvoiceCheck[] = [];

  public searchString: any;
  public searchVendors: string = '';
  public searchVendorOnly = true;

  private today = new Date();
  private twoYearsAgo = this.today.getFullYear() - 2;
  public horizon: number = this.twoYearsAgo;
  public pageTitle = "Vendors";
  public currentvendorname!: string;
  public vendoruno: any;
  public currentuno!: number;
  public vendorsLoaded = false;
  public parametersLoaded = false;

  public datedirection = false;
  public paiddirection = false;
  public amountdirection = false;
  public descriptionDirection = false;
  public sortnameASC = false;
  public sortByName = true;
  public sortByDescription = false;
  public sortByDate = false;
  public sortByPaid = false;
  public sortByAmount = false;

  public displayTransactions = false;
  public displayVendors = false;
  public displaySearchResults = false;
  public startDisplayResults = false;
  public loadingIndicator = true;

  public transInclude: FormGroup[] = [];
  public searchInclude: FormGroup[] = [];
  public selectSearches = false;
  public selectTrans = false;
  public modalTotal!: number;

  public historyInYears!: number;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private _route: Router,
    private transactionControls: FormBuilder,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.horizon = 2020;
    this.apiService.changePageTitle('Invoices');

    // if ( this.apiService.debug) { console.log("Horizon is: " + this.horizon); }
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
      // this.loadingIndicator = true;
      // await this.apiService.getVendor(this.historyInYears).subscribe( vendors => {
      //   this.vendors = vendors;
      //   if ( this.startDisplayResults == false ) this.loadingIndicator = false;
      //   this.vendorsLoaded = true;
      //   });
    }
    return null;
  }

  //******************************************* */
  //   Maniuplating data
  //******************************************* */

  async displayDescriptionSearch(search: string): Promise<any> {
    this.loadingIndicator = true;
    this.pageTitle = 'Invoice Search: ' + search;
    this.searchString = search;
    this.apiService.changePageTitle(this.pageTitle);

    this.startDisplayResults = true;
    this.loadingIndicator = true;
    this.searchDescriptions = [];
    this.displaySearchResults = true;
    this.displayVendors = false;
    if (this.apiService.debug == true) {
      // console.log(this.searchString);
      // console.log(this.horizon);
    }
    const tempInvoice: InvoiceTransaction[][] = [];
      // if (this.apiService.debug) { console.log(tempArray[0][0]); }
    this.apiService.getInvoiceBySearch(search, this.horizon).subscribe(v => {
      for (let i = 0; i < Object.values(v).length; i++) {
        tempInvoice.push(Object.values(v)[i]);
      }
      this.searchDescriptions = tempInvoice[0];
      // if (this.apiService.debug === true) { console.log(tempInvoice[0]); }
      // if (this.apiService.debug === true) { console.log("vendors should be done"); }
      for (let i = 0; i < this.searchDescriptions.length; i++) {
        let end = this.searchDescriptions[i].InvoiceNumber.length;
        for (let j = 0; j < this.searchDescriptions[i].InvoiceNumber.length; j++) {
          if (this.searchDescriptions[i].InvoiceNumber[j] === " ") {
            this.searchDescriptions[i].InvoiceNumber = this.searchDescriptions[i].InvoiceNumber.slice(0, j);
            j = end;
          }
        }

        this.searchInclude[i] = this.transactionControls.group({
          InvoiceTransactionID: new FormControl,
          Vendor: new FormControl,
          InvoiceNumber: new FormControl,
          InvoiceAmount: new FormControl,
          TransactionPostDate: new FormControl,
          CostCode: new FormControl,
          OfficeLocation: new FormControl,
          CombinedNarrative: new FormControl,
          Update: new FormControl
        });

      }
      this.sortSearchDescriptions('description');
      this.loadingIndicator = false;
      this.startDisplayResults = false;
      // if (this.apiService.debug == true)  { console.log(this.searchDescriptions); }
    });
    return;
  }

  async displayVendorSearch(search: string): Promise<any> {
    this.loadingIndicator = true;
    this.displayVendors = true;
    this.searchVendors = search;
    if (search) {
      this.pageTitle = 'Vendors: ' + search;
    } else {
      this.pageTitle = 'Vendors';
    }
    this.apiService.changePageTitle(this.pageTitle);
    this.loadingIndicator = true;
    const tempArray: any[] = [];
    // if (this.apiService.debug) { console.log('search: ' + search + " horizon: " + this.horizon); }
    this.apiService.getVendorBySearch(search, this.horizon).toPromise().then( v => {
      // if (this.apiService.debug == true) { console.log("vendors should be done"); }
      for ( let i = 0; i < Object.values(v).length; i++ ) {
        tempArray.push(Object.values(v)[i]);
      }
      this.vendors = tempArray[0];
      for ( let i = 0; i < this.vendors.length; i++ ) {
        this.vendors[i].Invoices = this.vendors[i].InvoiceTransaction.length;
        this.vendors[i].InvoiceTransaction.sort((a, b) => (a.InvoicePaidDate > b.InvoicePaidDate) ? -1 : 1);
        this.vendors[i].TotalInvoiceAmount = 0;
        this.vendors[i].LastPayment = this.vendors[i].InvoiceTransaction[0].InvoicePaidDate;
        for ( let j = 0; j < this.vendors[i].InvoiceTransaction.length; j++ ) {
          this.vendors[i].TotalInvoiceAmount = this.vendors[i].TotalInvoiceAmount + Number(this.vendors[i].InvoiceTransaction[j].InvoiceAmount);
        }
      }
      this.vendors = this.vendors.sort()
      this.vendors.sort((a, b) => (a.VendorName < b.VendorName ) ? -1 : 1)
      this.loadingIndicator = false;
    })
  }

  async getTransactions(uno: number): Promise<any> {
    this.currentuno = uno;
    this.vendorTransactions = [];
    const currentVendor = this.vendors.find( v => {
      return v.VendorUno === uno;
    })
    if (currentVendor) {
      this.vendorTransactions = currentVendor.InvoiceTransaction;
      // console.log(this.vendorTransactions);
      this.pageTitle = 'Vendor Transactions';
      this.apiService.changePageTitle(this.pageTitle);
      this.loadingIndicator = true;
      this.currentvendorname = currentVendor.VendorName;
      this.transInclude = [];
      this.displayTransactions = true;
      this.displayVendors = false;
      this.selectSearches = false;
      this.selectTrans = false;
      // if (this.apiService.debug) { console.log(this.vendorTransactions); }
      for ( let i = 0; i < this.vendorTransactions.length; i++ ) {
        let end = this.vendorTransactions[i].InvoiceNumber.length;
        for ( let j = 0; j < this.vendorTransactions[i].InvoiceNumber.length; j++ ) {
          if (this.vendorTransactions[i].InvoiceNumber[j] === " ") {
            this.vendorTransactions[i].InvoiceNumber = this.vendorTransactions[i].InvoiceNumber.slice(0,j);
            j = end;
          }
        }
        const tempAmount = Number(this.vendorTransactions[i].InvoiceAmount);
        this.vendorTransactions[i].InvoiceAmountFixed = tempAmount.toFixed(2);
        if (!currentVendor.VendorName) {
          this.transInclude[i] = this.transactionControls.group({
            // InvoiceAmountFixed: new FormControl,
            InvoiceAmount: new FormControl,
            InvoiceNumber: new FormControl,
            InvoiceDate: new FormControl,
            InvoicePaidDate: new FormControl,
            TransactionPostDate: new FormControl,
            CostCode: new FormControl,
            OfficeLocation: new FormControl,
            CombinedNarrative: new FormControl,
            Update: new FormControl
          });
        } else {
          this.transInclude[i] = this.transactionControls.group({
            currentVendorName: new FormControl,
            InvoiceAmount: new FormControl,
            InvoiceNumber: new FormControl,
            InvoiceDate: new FormControl,
            InvoicePaidDate: new FormControl,
            TransactionPostDate: new FormControl,
            CostCode: new FormControl,
            OfficeLocation: new FormControl,
            CombinedNarrative: new FormControl,
            Update: new FormControl
          });
        }
      }
      if (this.apiService.debug) { console.log(this.vendorTransactions); }
      this.sortTransaction('description');
      this.loadingIndicator = false;
    }


    // if (this.apiService.debug == true) { console.log(this.vendorTransactions); }
    return;
  }

  switchSearch() {
    this.searchVendorOnly = !this.searchVendorOnly;
    if (this.searchVendorOnly) {
      // console.log("in switchSeach \nsearchVendorOnly:" + this.searchVendorOnly);
      if (this.searchString) {
        this.searchVendors = this.searchString;
        this.addQueryParams({vendors: this.searchVendors, search: null});
        this.displayVendors = true;
        this.displaySearchResults = false;
        this.displayVendorSearch(this.searchVendors);
      }
      this.pageTitle = "Vendor Search: ";

    } else {
      // console.log("in switchSeach \nsearchVendorOnly:" + this.searchVendorOnly);
      if (this.searchVendors) {
        this.searchString = this.searchVendors;
        this.addQueryParams({vendors: null, search: this.searchString});
        this.displayVendors = false;
        this.displaySearchResults = true;
        this.displayDescriptionSearch(this.searchString);
      }
      this.pageTitle = "Invoice Search: ";

    }
    this.apiService.changePageTitle(this.pageTitle);
  }

  keyPressed(event: any) { // without type info
    // console.log("in keyPressed()");
    // wait 300ms after each keystroke before considering the term
    debounceTime(10000);
    if (event.keyCode === 13) {
      if (this.searchVendorOnly) {
        this.displayVendorSearch(event.target.value);
        this.addQueryParams({vendors: event.target.value});
      } else {
        this.displayDescriptionSearch(event.target.value);
        this.addQueryParams({search: event.target.value});

      }

    }
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
    else if ( this.searchString ) {
      this.displayDescriptionSearch(this.searchString);
    }
    else {
      console.log("Something is wrong reloading data")
    }
  }

  selectSearchedItems(): Promise<any> {
    let tempSearches: any;
    this.modalTotal = 0;
    this.selectedSearches = [];
    for ( let i = 0; i < this.searchInclude.length; i++ ) {
      if ( this.searchInclude[i].value.Update == true ) {
        this.selectedSearches.push(this.searchDescriptions[i]);
        // console.log(this.searchDescriptions[i]);
        if ( this.searchDescriptions[i].InvoiceAmount ) {
          const tempAmount = Number(this.searchDescriptions[i].InvoiceAmount);
          this.searchDescriptions[i].InvoiceAmountFixed = tempAmount.toFixed(2);
          this.modalTotal = this.modalTotal + tempAmount;
      } else {
          // console.log("no transaction amount");
          // console.log(this.searchDescriptions[i]);
        }
      }
    }
    // if (this.apiService.debug == true) { console.log(this.modalTotal); }
    tempSearches = this.selectedSearches;
    return tempSearches;
  }

  selectTransactions(): Promise<any> {
    let tempTransactions: any;
    this.modalTotal = 0;
    this.selectedTransactions = [];
    for ( let i = 0; i < this.transInclude.length; i++ ) {
      if ( this.transInclude[i].value.Update == true ) {
        this.selectedTransactions.push(this.vendorTransactions[i]);
        if ( this.vendorTransactions[i].InvoiceAmount ) {
          const tempAmount = Number(this.vendorTransactions[i].InvoiceAmount);
          // this.vendorTransactions[i].InvoiceAmountFixed = tempAmount.toFixed(2);
          this.modalTotal = this.modalTotal + tempAmount;
        }
        else {
          // console.log("no transaction amount");
          // console.log(this.vendorTransactions[i]);
        }
      }
    }
    // if (this.apiService.debug == true) { console.log(this.modalTotal); }
    tempTransactions = this.selectedTransactions;
    return tempTransactions;
  }

  setAll() {
    this.selectTrans = !this.selectTrans;
    for ( let i = 0 ; i < this.vendorTransactions.length; i ++ ) {
      if ( this.selectTrans == true ) {
        this.transInclude[i].controls.Update.setValue(true);
      }
      else {
        this.transInclude[i].controls.Update.setValue(false);
      }
    }
  }

  setHistory(setHorizon: number): number {
    this.horizon = this.today.getFullYear() - setHorizon;
    // console.log(this.horizon)
    return this.horizon;
  }

  setSearchAll() {
    this.selectSearches = !this.selectSearches;
    for ( let i = 0 ; i < this.searchDescriptions.length; i ++ ) {
      if ( this.selectSearches === true ) {
        this.searchInclude[i].controls.Update.setValue(true);
      }
      else {
        this.searchInclude[i].controls.Update.setValue(false);
      }
    }
  }

  convertToNum(input: unknown): number {
    let tempNum: number;
    let tempUnk: string;
    tempUnk = input as string;
    tempNum = parseInt(tempUnk);
    return tempNum;
  }

  getVendorName(invoice: any): string {
    let tempName: string = "";
    if (invoice.Vendor) {
      tempName = invoice.Vendor.VendorName;
    }
    return tempName;
  }

  sortSearchDescriptions(sortby: string) {
    this.sortByAmount = false;
    this.sortByDate = false;
    this.sortByDescription = false;
    this.sortByName = false;
    this.sortByPaid = false;
    this.selectedSearches = this.searchDescriptions;
    this.searchDescriptions = [];

    switch (sortby) {
      case 'amount':
        this.sortByAmount = true;
        this.amountdirection = !this.amountdirection;
        this.datedirection = false;
        this.descriptionDirection = false;
        this.sortnameASC = false;
        this.paiddirection = false
        if ( this.amountdirection ) {
          this.selectedSearches.sort((a, b) => (this.convertToNum(a.InvoiceAmount)  < this.convertToNum(b.InvoiceAmount) ) ? -1 : 1)
        }
        else {
          this.selectedSearches.sort((a, b) => (this.convertToNum(a.InvoiceAmount)  > this.convertToNum(b.InvoiceAmount) ) ? -1 : 1)
        }
        break;
      case 'date':
        this.sortByDate = true;
        this.datedirection = !this.datedirection;
        this.amountdirection = false;
        this.descriptionDirection = false;
        this.sortnameASC = false;
        this.paiddirection = false
        if ( this.datedirection == false ) {
          this.selectedSearches.sort((a, b) => (a.InvoicePaidDate  > b.InvoicePaidDate ) ? -1 : 1)
        }
        else {
          this.selectedSearches.sort((a, b) => (a.InvoicePaidDate  < b.InvoicePaidDate ) ? -1 : 1)
        }
        break;
      case 'description':
        this.sortByDescription = true;
        this.descriptionDirection = !this.descriptionDirection;
        this.amountdirection = false;
        this.datedirection = false;
        this.sortnameASC = false;
        this.paiddirection = false
        if ( this.descriptionDirection == false ) {
          this.selectedSearches.sort((a, b) => (a.CombinedNarrative.slice(0,50)  > b.CombinedNarrative.slice(0,50) ) ? -1 : 1)
        }
        else {
          this.selectedSearches.sort((a, b) => (a.CombinedNarrative.slice(0,50)  < b.CombinedNarrative.slice(0,50) ) ? -1 : 1)
        }
        break;
      case 'name':
        this.sortByName = true;
        this.amountdirection = false;
        this.datedirection = false;
        this.descriptionDirection = false;
        this.paiddirection = false;
        this.sortnameASC = !this.sortnameASC;
        if ( this.sortnameASC == false ) {
          this.selectedSearches.sort((a, b) => (this.getVendorName(a) > this.getVendorName(b)) ? -1 : 1)
        }
        else {
          this.selectedSearches.sort((a, b) => (this.getVendorName(a) < this.getVendorName(b)) ? -1 : 1)
        }
        break;
      case 'paid':
        this.sortByPaid = true;
        this.descriptionDirection = false;
        this.amountdirection = false;
        this.datedirection = false;
        this.sortnameASC = false;
        this.paiddirection = !this.paiddirection;
        if ( this.paiddirection == false ) {
          this.selectedSearches.sort((a, b) => (a.InvoicePaidDate < b.InvoicePaidDate) ? -1 : 1)
        }
        else {
          this.selectedSearches.sort((a, b) => (a.InvoicePaidDate > b.InvoicePaidDate) ? -1 : 1)
        }
        break;
    }
    for ( let i = 0; i < this.selectedSearches.length; i++ ) {
      this.searchDescriptions.push(this.selectedSearches[i]);
    }
    if (this.apiService.debug) { console.log(this.searchDescriptions); }
  }

  sortTransaction(sortby: string) {
    this.sortByAmount = false;
    this.sortByDate = false;
    this.sortByDescription = false;
    this.sortByPaid = false;
    this.selectedTransactions = this.vendorTransactions;
    this.vendorTransactions = [];
    if (this.apiService.debug) {console.log('sortby: ' + sortby); }
    switch (sortby) {
      case "amount":
        // if (this.apiService.debug) {console.log('in amount: \n   amountdirection: ' + this.amountdirection + '\n   sortByAmount: ' + this.sortByAmount); }
        this.amountdirection = !this.amountdirection;
        this.sortByAmount = true;
        // if (this.apiService.debug) {console.log('in amount: \n   amountdirection: ' + this.amountdirection + '\n   sortByAmount: ' + this.sortByAmount); }
        // if (this.apiService.debug) {console.log('\n   datedirection: ' + this.datedirection + '\n   sortByDate: ' + this.sortByDate); }
        if ( this.amountdirection == false ) {
          this.selectedTransactions.sort((a, b) => (this.convertToNum(a.InvoiceAmount) < this.convertToNum(b.InvoiceAmount)) ? -1 : 1)
        }
        else {
          this.selectedTransactions.sort((a, b) => (this.convertToNum(a.InvoiceAmount) > this.convertToNum(b.InvoiceAmount)) ? -1 : 1)
        }
      case "date":
        this.datedirection = !this.datedirection;
        this.sortByDate = true;
        if ( this.datedirection == false ) {
          this.selectedTransactions.sort((a, b) => (a.InvoiceDate > b.InvoiceDate) ? -1 : 1)
        }
        else {
          this.selectedTransactions.sort((a, b) => (a.InvoiceDate < b.InvoiceDate) ? -1 : 1)
        }
        break;
      case "description":
        this.descriptionDirection = !this.descriptionDirection;
        this.sortByDescription = true;
        if ( this.descriptionDirection ) {
          this.selectedTransactions.sort((a, b) => (a.CombinedNarrative.slice(0,50) < b.CombinedNarrative.slice(0,50)) ? -1 : 1)
        }
        else {
          this.selectedTransactions.sort((a, b) => (a.CombinedNarrative.slice(0,50) > b.CombinedNarrative.slice(0,50)) ? -1 : 1)
        }
        break;
      case "paid":
        this.paiddirection = !this.paiddirection;
        this.sortByPaid = true;
        if ( this.paiddirection == false ) {
          this.selectedTransactions.sort((a, b) => (a.InvoicePaidDate > b.InvoicePaidDate) ? -1 : 1)
        }
        else {
          this.selectedTransactions.sort((a, b) => (a.InvoicePaidDate < b.InvoicePaidDate) ? -1 : 1)
        }
        break;
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

  addQueryParams(query: string | { [s: string]: any; } | ArrayLike<any> | null | any): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    // if (this.apiService.debug == true) if (this.apiService.debug == true) console.log(query);
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
    this.searchVendorOnly = true;
    this.searchVendors = '';
    this.searchString = null;
    this.displayVendors = false;
    this.displayTransactions = false;
    this.displaySearchResults = false;
    this.vendors = [];
    this.pageTitle = "Vendors";
    this.apiService.changePageTitle(this.pageTitle);
    this.loadingIndicator = false;
  }

  async executeQueryParams(queryStrings: ArrayLike<unknown> | { [s: string]: unknown; }): Promise<any> {
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    // if (this.apiService.debug == true) console.log("queries"); console.log(queries);
    for (const q of queries) {
      switch (q[0]) {
        case 'vendors':
          const tempQ: any = q[1];
          this.searchVendors = tempQ;
          this.searchVendorOnly = true;
          this.displayVendorSearch(this.searchVendors);
          break;
        case 'search':
          this.searchString = q[1];
          this.searchVendorOnly = false;
          this.displayDescriptionSearch(this.searchString);
          break;
        case 'horizon':
          const tempQNum: any = q[1];
          this.horizon = +tempQNum;
          break;
      }
    }
    return;
  }

  openWindow(content: any): void {
    this.modalService.open(content, { size: 'xl'});
  }


}

