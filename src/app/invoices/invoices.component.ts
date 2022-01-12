import { Component, OnInit, Injectable, ViewChildren, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, FormArray, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from './../api.service';
import { Vendor, VendorSearch, InvoiceCheck, InvoiceTransaction} from './../datatables/data';


@Input()

@Component({
  selector: 'app-root',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent {
  title = 'AM-Invoices';
  public vendors: Vendor[];
  public currentVendor: Vendor;
  public transactions: InvoiceTransaction[];
  public vendorTransactions: InvoiceTransaction[];
  public selectedTransactions: InvoiceTransaction[];
  public searchDescriptions: InvoiceTransaction[];
  public selectedSearches: InvoiceTransaction[];
  public checks: InvoiceCheck[];

  public searchString: any;
  public searchVendors = null;
  public searchVendorOnly = true;

  private today = new Date();
  private twoYearsAgo = this.today.getFullYear() - 2;
  private threeYearsAgo = this.today.getFullYear() - 3;
  private fiveYearsAgo = this.today.getFullYear() - 5;
  private allRecords = this.today.getFullYear() - 50;
  public horizon: number = this.twoYearsAgo;
  public pageTitle = "Vendors";
  public currentvendorname;
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
  public displayVendors = false;
  public displaySearchResults = false;
  public startDisplayResults = false;
  public loadingIndicator = true;

  public transInclude: FormGroup[] = [];
  public searchInclude: FormGroup[] = [];
  public selectSearches = false;
  public selectTrans = false;
  public modalTotal;

  public historyInYears: number;

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

    if ( this.apiService.debug) { console.log("Horizon is: " + this.horizon); }
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

  async displayRobustSearch(search: string): Promise<any> {
    this.loadingIndicator = true;
    this.pageTitle = 'Invoice Search: ' + search;
    this.searchString = search;
    this.apiService.changePageTitle(this.pageTitle);

    this.startDisplayResults = true;
    this.loadingIndicator = true;
    this.sortnameASC = false;
    this.amountdirection = false;
    this.datedirection = true;
    this.searchDescriptions = [];
    this.displaySearchResults = true;
    this.displayVendors = false;
    if (this.apiService.debug == true) {
      // console.log(this.searchString);
      // console.log(this.horizon);
    }
    const tempArray = [];
      // if (this.apiService.debug) { console.log(tempArray[0][0]); }
      this.vendors = tempArray[0];
    await this.apiService.getInvoiceBySearch(search, this.horizon).subscribe( v => {

      for ( let i = 0; i < Object.values(v).length; i++ ) {
        tempArray.push(Object.values(v)[i]);
      }
      this.searchDescriptions = tempArray[0];
      if (this.apiService.debug == true) { console.log(tempArray[0]); }
      if (this.apiService.debug == true) { console.log("vendors should be done"); }
      for ( let i = 0; i < this.searchDescriptions.length; i++ ) {
        let end = this.searchDescriptions[i].InvoiceNumber.length;
        for ( let j = 0; j < this.searchDescriptions[i].InvoiceNumber.length; j++ ) {
          if (this.searchDescriptions[i].InvoiceNumber[j] === " ") {
            this.searchDescriptions[i].InvoiceNumber = this.searchDescriptions[i].InvoiceNumber.slice(0,j);
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
      this.sortDate('date');
      this.loadingIndicator = false;
      this.startDisplayResults = false;
      if (this.apiService.debug == true) console.log(this.searchDescriptions);
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
    const tempArray = [];
    if (this.apiService.debug) { console.log('search: ' + search + " horizon: " + this.horizon); }
    this.apiService.getVendorBySearch(search, this.horizon).toPromise().then( v => {
      if (this.apiService.debug == true) console.log("vendors should be done");
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
      console.log(this.vendorTransactions);
      this.pageTitle = 'Vendor Transactions';
      this.apiService.changePageTitle(this.pageTitle);
      this.loadingIndicator = true;
      this.currentvendorname = currentVendor.VendorName;
      this.transInclude = [];
      this.displayTransactions = true;
      this.displayVendors = false;
      this.selectSearches = false;
      this.selectTrans = false;
      this.datedirection = true;
      this.sortByDate = true;
      if (this.apiService.debug) { console.log(this.vendorTransactions); }
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
      // if (this.apiService.debug) { console.log(this.vendorTransactions); }
      this.sortTransaction('date');
      this.loadingIndicator = false;
    }


    // if (this.apiService.debug == true) console.log(this.vendorTransactions);
    return;
  }

  switchSearch() {
    this.searchVendorOnly = !this.searchVendorOnly;
    if (this.searchVendorOnly) {
      console.log("in switchSeach \nsearchVendorOnly:" + this.searchVendorOnly);
      if (this.searchString) {
        this.searchVendors = this.searchString;
        this.addQueryParams({vendors: this.searchVendors, search: null});
        this.displayVendors = true;
        this.displaySearchResults = false;
        this.displayVendorSearch(this.searchVendors);
      }
      this.pageTitle = "Vendor Search: ";

    } else {
      console.log("in switchSeach \nsearchVendorOnly:" + this.searchVendorOnly);
      if (this.searchVendors) {
        this.searchString = this.searchVendors;
        this.addQueryParams({vendors: null, search: this.searchString});
        this.displayVendors = false;
        this.displaySearchResults = true;
        this.displayRobustSearch(this.searchString);
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
        this.displayRobustSearch(event.target.value);
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
      this.displayRobustSearch(this.searchString);
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
      if ( this.searchInclude[i].value.Update == true ) {
        this.selectedSearches.push(this.searchDescriptions[i]);
        console.log(this.searchDescriptions[i]);
        if ( this.searchDescriptions[i].InvoiceAmount ) {
          const tempAmount = Number(this.searchDescriptions[i].InvoiceAmount);
          this.searchDescriptions[i].InvoiceAmountFixed = tempAmount.toFixed(2);
          this.modalTotal = this.modalTotal + tempAmount;
      } else {
          console.log("no transaction amount");
          console.log(this.searchDescriptions[i]);
        }
      }
    }
    if (this.apiService.debug == true) console.log(this.modalTotal);
    tempSearches = this.selectedSearches;
    return tempSearches;
  }

  selectTransactions(): Promise<any> {
    let tempTransactions;
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
          console.log("no transaction amount");
          console.log(this.vendorTransactions[i]);
        }
      }
    }
    if (this.apiService.debug == true) console.log(this.modalTotal);
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
    console.log(this.horizon)
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

  sortAmount() {
    this.sortByDate = false;
    this.sortByAmount = true;
    this.sortByName = false;
    this.selectedSearches = this.searchDescriptions;
    this.searchDescriptions = [];
    // if (this.apiService.debug == true) console.log("amountdirection is " + this.amountdirection);

    this.amountdirection = !this.amountdirection;
    if ( this.amountdirection == false ) {
      this.selectedSearches.sort( function(a, b) {
      let key1 = a.InvoiceAmount;
      let key2 = b.InvoiceAmount;
        if ( key1 > key2 ) return 1;
        else if ( key1 == key2 ) return 0;
        else return -1;
      })
    }
    else {
      this.selectedSearches.sort( function(a, b) {
        let key1 = a.InvoiceAmount;
        let key2 = b.InvoiceAmount;
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
          this.selectedSearches.sort((a, b) => (a.InvoicePaidDate  > b.InvoicePaidDate ) ? -1 : 1)
        }
        else {
          this.selectedSearches.sort((a, b) => (a.InvoicePaidDate  < b.InvoicePaidDate ) ? -1 : 1)
        }
      }
      else {
        this.sortByDate = false;
        this.sortByPaid = true;
        this.paiddirection = !this.paiddirection;
        if ( this.paiddirection == false ) {
          this.selectedSearches.sort((a, b) => (a.InvoicePaidDate < b.InvoicePaidDate) ? -1 : 1)
        }
        else {
          this.selectedSearches.sort((a, b) => (a.InvoicePaidDate > b.InvoicePaidDate) ? -1 : 1)
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
    // if (this.apiService.debug == true) console.log("sortnameASC is " + this.sortnameASC);
    if ( this.sortnameASC == false ) {
      this.selectedSearches.sort( function(a, b) {
        let key1 = a.VendorName;
        let key2 = b.VendorName;
        if ( key1 > key2 ) return 1;
        else if ( key1 == key2 ) return 0;
        else return -1;
      })
    }
    else {
      this.selectedSearches.sort( function(a, b) {
        let key1 = a.VendorName;
        let key2 = b.VendorName;
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
        this.selectedTransactions.sort((a, b) => (a.InvoiceDate > b.InvoiceDate) ? -1 : 1)
      }
      else {
        this.selectedTransactions.sort((a, b) => (a.InvoiceDate < b.InvoiceDate) ? -1 : 1)
      }
    }
    else if ( sortby == "paid" ) {
      this.paiddirection = !this.paiddirection;
      this.sortByPaid = true;
      this.sortByAmount = false;
      this.sortByDate = false;
      if ( this.paiddirection == false ) {
        this.selectedTransactions.sort((a, b) => (a.InvoicePaidDate > b.InvoicePaidDate) ? -1 : 1)
      }
      else {
        this.selectedTransactions.sort((a, b) => (a.InvoicePaidDate < b.InvoicePaidDate) ? -1 : 1)
      }
    }
    else if ( sortby == "amount" ) {
      this.amountdirection = !this.amountdirection;
      this.sortByAmount = true;
      this.sortByDate = false;
      this.sortByPaid = false;
      if ( this.amountdirection == false ) {
        this.selectedTransactions.sort( function(a, b) {
        let key1 = a.InvoiceAmount;
        let key2 = b.InvoiceAmount;
          if ( key1 > key2 ) return 1;
          else if ( key1 == key2 ) return 0;
          else return -1;
        })
      }
      else {
        this.selectedTransactions.sort( function(a, b) {
          let key1 = a.InvoiceAmount;
          let key2 = b.InvoiceAmount;
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
    this.searchVendors = null;
    this.searchString = null;
    this.displayVendors = false;
    this.displayTransactions = false;
    this.displaySearchResults = false;
    this.vendors = [];
    this.pageTitle = "Vendors";
    this.apiService.changePageTitle(this.pageTitle);
    this.loadingIndicator = false;
  }

  async executeQueryParams(queryStrings): Promise<any> {
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    // if (this.apiService.debug == true) console.log("queries"); console.log(queries);
    for (const q of queries) {
      switch (q[0]) {
        case 'vendors':
          this.searchVendors = q[1];
          this.searchVendorOnly = true;
          this.displayVendorSearch(this.searchVendors);
          break;
        case 'search':
          this.searchString = q[1];
          this.searchVendorOnly = false;
          this.displayRobustSearch(this.searchString);
          break;
        case 'horizon':
          this.horizon = +q[1];
          break;
      }
    }
    return;
  }

  openWindow(content): void {
    this.modalService.open(content, { size: 'xl'});
  }


}

