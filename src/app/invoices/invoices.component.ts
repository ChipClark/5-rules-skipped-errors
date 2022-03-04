import { Component, OnInit, Injectable, ViewChildren, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, FormArray, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Input()

@Component({
  selector: 'app-root',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent {
  title = 'AM-Invoices';

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
    private route: ActivatedRoute,
    private _route: Router,
    private transactionControls: FormBuilder,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.horizon = 2020;

    this.accessParameters();
   }

  ngDoCheck() {}


  //******************************************* */
  //   Maniuplating data
  //******************************************* */

  async displayDescriptionSearch(search: string): Promise<any> {
    this.loadingIndicator = true;
    this.pageTitle = 'Invoice Search: ' + search;
    this.searchString = search;

    this.startDisplayResults = true;
    this.loadingIndicator = true;
    this.displaySearchResults = true;
    this.displayVendors = false;
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

  }

  async getTransactions(uno: number): Promise<any> {
    this.currentuno = uno;
    return;
  }

  switchSearch() {
    this.searchVendorOnly = !this.searchVendorOnly;

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

  }

  selectSearchedItems(): Promise<any> {
    let tempSearches: any;
    this.modalTotal = 0;
    return tempSearches;
  }

  selectTransactions(): Promise<any> {
    let tempTransactions: any;
    this.modalTotal = 0;
    return tempTransactions;
  }

  setAll() {

  }

  setHistory(setHorizon: number): number {
    this.horizon = this.today.getFullYear() - setHorizon;
    // console.log(this.horizon)
    return this.horizon;
  }

  setSearchAll() {

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



  }

  sortTransaction(sortby: string) {
  }


  //******************************************* */
  //   Navigation and Parameters
  //******************************************* */

  accessParameters(): void {

  }

  addQueryParams(query: string | { [s: string]: any; } | ArrayLike<any> | null | any): void {
  }

  clearQueryParams(): void {
  }

  clearFilters() {
  }

  async executeQueryParams(queryStrings: ArrayLike<unknown> | { [s: string]: unknown; }): Promise<any> {
    return;
  }

  openWindow(content: any): void {
    this.modalService.open(content, { size: 'xl'});
  }


}

