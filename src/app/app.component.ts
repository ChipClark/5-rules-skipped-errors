import { Component, OnInit, Injectable, ViewChildren, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { DatePipe } from '@angular/common';
import { FormsModule, FormGroup, FormArray, FormControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';

import { ApiService } from './api-service.service';
import { Vendor, InvoiceCheck, InvoiceTransaction} from './datatables/data';


@Input() 

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

  public searchTerm = null;
  private today = new Date;
  // private currentDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');

  
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private _route: Router,
    // private datePipe: DatePipe,
    
  ) { this.loadData(); }


  async loadData(): Promise<any> {
    this.apiService.debug = true;
    this.apiService.datatype = 'remote';

    await this.apiService.getVendor().subscribe( vendors => {
      this.vendors = vendors;
      if (this.apiService.debug == true) console.log(this.vendors);
      // this.apiService.getInvoice().toPromise().then( invoiceTransaction => {
      //   this.invoiceTransaction = invoiceTransaction;
      //   this.apiService.getCheck().toPromise().then( invoiceCheck => {
      //     this.invoiceCheck = invoiceCheck;
          
      //   })
      // })
    })
    return;
  }

  //******************************************* */
  //   Navigation and Parameters
  //******************************************* */

  accessParameters() {
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
    //if (this.apiService.debug == true) console.log(query);
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
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    // for (const q of queries) {
    //   switch (q[0]) {
    //     case 'role':
    //       this.materials.staffMenu.controls.staffController.setValue(+q[1]);
    //       this.roleid = +q[1];
    //       break;
    //     case 'city':
    //       this.materials.cityMenu.controls.cityController.setValue(+q[1]);
    //       this.cityid = +q[1];
    //       break;
    //     case 'search':
    //       this.searchTerm = q[1];
    //       break;
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
    //   }
    // }
  }

  // includeCities(cityid): void {
  //   const index = this.cityidArray.indexOf(cityid);
  //   if (index == -1) {
  //     this.cityidArray.push(cityid);
  //   } else {
  //     this.cityidArray.splice(index, 1);
  //   }
  //   this.addQueryParams({ cities: this.cityidArray.toString() })
  // }


}
