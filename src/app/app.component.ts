import { Component, OnInit, Injectable, ViewChildren, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { DatePipe } from '@angular/common';
import { FormsModule, FormGroup, FormArray, FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MaterialModule } from './material/material.module';  // Checkbox and dropdown menus

import { ApiService } from './api-service.service';
import { Vendor, VendorSearch, InvoiceCheck, InvoiceTransaction} from './datatables/data';


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
  public checks: InvoiceCheck[];
  public datedirection = false;
  public sortamount = false;
  public sortByDate = true;
  public searchString: string;
  public searchDescriptions: VendorSearch[];

  public searchTerm = null;
  private today = new Date;
  public vendorname;
  public vendoruno;

  public displayTransactions = false;
  public displayVendors = true;

  public transInclude: FormGroup[] = [];
  public selectTrans = false;
  public modalTotal;
  // private currentDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');


  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private _route: Router,
    public materials: MaterialModule,
    private transactionControls: FormBuilder,
    private modalService: NgbModal,
    // private datePipe: DatePipe,

  ) { this.loadData(); }


  async loadData(): Promise<any> {
    this.apiService.debug = true;
    this.apiService.datatype = 'remote';

    await this.apiService.getVendor().subscribe( vendors => {
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
    })
    this.accessParameters();
    return;
  }

  async buildTransactions(): Promise<any> {
    for ( let i = 0; i < this.transactions.length; i++ ) {
      // this.transactions[i].invoiceamount = (Math.round(this.transactions[i].invoiceamount * 100) / 100).toFixed(2);

      let tempVendor = await this.vendors.find( v => {
        return v.vendoruno === this.transactions[i].vendoruno;
      })
      if ( tempVendor ) {
        this.transactions[i].vendorname = tempVendor.vendorname;
      }
      // console.log(tempVendor);
      // console.log(this.transactions[i].vendoruno);
      // this.transactions[i].vendorname = tempVendor.vendorname;
    }
    return;
  }

  //******************************************* */
  //   Maniuplating data
  //******************************************* */

  async displaySearch(): Promise<any> {
    if (this.apiService.debug == true) console.log(this.searchString);
    await this.apiService.getVendorTransactionBySearch(this.searchString).toPromise().then( searchDescriptions => {
      this.searchDescriptions = searchDescriptions;
    });
    return;
  }

  async getTransactions(uno: number, sort: string): Promise<any> {
    this.vendorTransactions = [];
    this.displayTransactions = true;
    this.displayVendors = false;
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

  selectTransactions(): Promise<any> {
    let tempTransactions;
    this.modalTotal = 0;
    this.selectedTransactions = [];
    for ( let i = 0; i < this.transInclude.length; i++ ) {
      if ( this.transInclude[i].value.update == true ) {
        this.selectedTransactions.push(this.vendorTransactions[i]);
        console.log(this.vendorTransactions[i]);
        this.modalTotal = this.modalTotal + this.vendorTransactions[i].invoiceamount;
      }
    }
    console.log(this.modalTotal);
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
    // if (this.apiService.debug == true) console.log("in addQueryParams()");
    // if (this.apiService.debug == true) console.log(query);
    const keys = Object.keys(query);
    const values = Object.values(query);
    // for (let i = 0; i < keys.length; i++ ) {
    //   switch (keys[i]) {
    //     case 'city':
    //       this.cityid = values[0];
    //       this.materials.cityMenu.controls.cityController.setValue(values[0]);
    //       break;
    //     case 'staff':
    //       this.roleid = values[0];
    //       this.materials.staffMenu.controls.staffController.setValue(values[0]);
    //       break;
    //   }
    // }
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
    // this.materials.staffController = null;
    // this.materials.cityController = null;
    // this.staffController = this.materials.staffController;
    // this.cityController = this.materials.cityController;
    // this.staffDeptId = 0;
    // this.timekeeperDeptId = '';
    // this.cityidArray = [4, 1, 2, 3, 5];
    // this.roleidArray = [13, 2, 1, 10, 20];
    // this.roleCheckAll = true;
    // this.cityid = null;
    // this.roleid = null;
    this.searchTerm = null;
  }

  executeQueryParams(queryStrings): void {
    // if (this.apiService.debug == true) console.log(queryStrings);
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    for (const q of queries) {
      switch (q[0]) {
    //     case 'role':
    //       this.materials.staffMenu.controls.staffController.setValue(+q[1]);
    //       this.roleid = +q[1];
    //       break;
    //     case 'city':
    //       this.materials.cityMenu.controls.cityController.setValue(+q[1]);
    //       this.cityid = +q[1];
    //       break;
        case 'search':
          this.searchTerm = q[1];
          break;
    //     case 'cities':
    //       this.cityidArray = (q[1] as string).split(',').map(Number);
    //       this.showAdvFilter = true;
    //       break;
    //     case 'roles':
    //       this.cityidArray = (q[1] as string).split(',').map(Number);
    //       this.showAdvFilter = true;
    //       break;
    //     case 'staffdept':
    //       this.staffDeptId = +q[1];
    //       this.showAdvFilter = true;
    //       break;
    //     case 'timekeeperdept':
    //       this.timekeeperDeptId = (q[1] as string);
    //       this.showAdvFilter = true;
    //       break;
      }
    }
  }

  openWindow(content): void {
    this.modalService.open(content, { size: 'lg'});
  }


}
