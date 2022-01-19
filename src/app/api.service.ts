import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpHandler, HttpRequest } from '@angular/common/http';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap, concat } from 'rxjs/operators';

import { Vendor, VendorSearch, InvoiceTransaction, InvoiceCheck } from './datatables/data';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // public baseURL = 'http://am-web12:3035/api/v1/';  // Test Server
  // public baseURL = 'http://am-web05:3030/api/v1/';  // AM-WEB05 Production server
  // public baseURL = 'http://am-web11:3070/api/'; // new API server
  public baseURL = 'http://am-web05:3080/api/';  // AM-WEB05 Production server
  public tempDATA = '/assets/';
  public debug = false;

  public summary = 'summary/transactions/';
  public summaryTransactions = 'summary/transactions/';
  public vendors = 'vendors/';
  public invoices = 'invoices/';


  public transactionFilter = "filter[where][lastpayment][gt]=2017-01-01T18:30:00.000Z"
  public pagetitle = 'Invoices';

  public chrome;

  public datatype: string;
  public datedirection = true;
  public sortAmount = true;
  public loadingIndicator = true;
  public recordHistory: string;
  public horizondate: string;
  public titleSource = new  BehaviorSubject(this.pagetitle);


  constructor( private http: HttpClient ) { }

  setDataLocation() {
    if ( this.datatype == 'local' ) {
      this.baseURL = this.tempDATA;
    }
  }

  getVendor (num: number, search?: string): Observable<Vendor[]> {
    let url = this.baseURL + 'vendors/';
    if (search) {
      url = url + "?search=" + search;
    }
    // if ( this.debug == true ) console.log(url);
    return this.http.get<Vendor[]>(url)
      .pipe(
        tap(results => {
          console.log("API data retrieved successully")
          this.loadingIndicator = false
        }),
        catchError(this.handleError('Vendor data', [])),
      );
  }

  //   *****************
  //   CURRENTLY NOT IN USE
  //   *****************
  getInvoice(horizon?: number): Observable<InvoiceTransaction[]> {
    var historyFilter, orderFilter;
    let url = this.baseURL + 'invoices/';
    if (horizon) {
      url = url + "?year=" + horizon;
    }
    if (this.debug === true) console.log(url);
    let invoiceResults = this.http.get<InvoiceTransaction[]>(url)
      .pipe(
        tap(people => {
          console.log("API data retrieved successully")
          this.loadingIndicator = false
        }),
        catchError(this.handleError('Invoice data', [])),
      );
    if (this.debug === true) console.log(invoiceResults);
    return invoiceResults;
  }

  getInvoiceByUno(uno: number, horizon: number): Observable<InvoiceTransaction[]> {
    let url = this.baseURL + 'invoices/vendor/?vendoruno=' + uno;
    if (horizon) {
      url = url + "&year=" + horizon;
    }
    if (this.debug == true) console.log(url);
    let transactions =  this.http.get<InvoiceTransaction[]>(url)
      .pipe(
        tap(transactions => console.log("API data retrieved successully")),
        catchError(this.handleError('Invoice data', [])),
      );
    return transactions;
  }

  getInvoiceBySearch(search: string, horizon?: number): Observable<InvoiceTransaction[]> {
    // this.setDataLocation();
    let url = this.baseURL + 'invoices/?search='+ search;
    if (horizon) {
      url = url + "&year=" + horizon;
    }
    // if (this.debug === true) { console.log(url); }
    let invoiceResults = this.http.get<InvoiceTransaction[]>(url)
      .pipe(
        tap(invoices => {
          console.log("API Invoice data retrieved")
          this.loadingIndicator = false
          // if (this.debug == true) { console.log(invoices); }
        }),
        catchError(this.handleError('Invoice data', [])),
      );

    return invoiceResults;
  }

  getVendorBySearch(searchString: string, year?: number): Observable<any> {
    this.loadingIndicator = true;
    var url;
    if ( !searchString ) { }
    else {
      searchString = searchString.split(" ").join("%20");
    }
    // if (year) {
    //   url = this.baseURL + this.summaryTransactions + "?year=" + year + "&search=" + searchString;
    // } else {
    //   url = this.baseURL + this.summaryTransactions + "?year=" + 1900 + "&search=" + searchString;
    // }
    if (year) {
      url = this.baseURL + this.vendors + "?year=" + year + "&search=" + searchString;
    } else {
      url = this.baseURL + this.vendors + "?year=" + 1900 + "&search=" + searchString;
    }
    // if ( this.debug === true ) { console.log(url); }

    let searchResults =  this.http.get<VendorSearch[]>(url).pipe(
      tap(searchResults => {
        console.log("searchResults retrieved successully")
        this.loadingIndicator = false
      }),
      catchError(this.handleError('vendorsearch data', [])),
    );
    return searchResults;
  }


  getVendorFullSearch(searchString: string, year: number): Observable<InvoiceTransaction[]> {
    this.loadingIndicator = true;
    var url;
    if ( !searchString ) { }
    else {
      searchString = searchString.split(" ").join("%20");
    }
    if (year) {
      url = this.baseURL + this.vendors + "?year=" + year + "&search=" + searchString;
    } else {
      url = this.baseURL + this.vendors + "?year=" + 1900 + "&search=" + searchString;
    }

    // if ( this.debug == true ) { console.log(url); }
    let searchResults =  this.http.get<InvoiceTransaction[]>(url).pipe(
      tap(searchResults => {
        console.log("searchResults retrieved successully")
        this.loadingIndicator = false
      }),
      catchError(this.handleError('vendorsearch data', [])),
    );
    return searchResults;
  }

  getCheck (): Observable<InvoiceCheck[]> {
    this.setDataLocation();
    this.loadingIndicator = true;
    this.baseURL += 'invoicecheck';
    // if (this.debug == true) console.log(this.baseURL);
    return this.http.get<InvoiceCheck[]>(this.baseURL)
      .pipe(
        tap(people => {
          console.log("API data retrieved successully")
          this.loadingIndicator = false
        }),
        catchError(this.handleError('InvoiceCheck data', [])),
      );
  }

  // *************************************************
  //
  // Sharing Data between components
  //
  //

  changePageTitle(title: string): void {
    this.titleSource.next(title);
  }

  getChrome(chrome?: boolean): Observable<any> {
    if ( chrome ) { return of(chrome); }
    return of(this.chrome);
  }

  setChrome(chrome: boolean): void {
    this.chrome = chrome;
    this.getChrome(chrome);
  }

  setPageTitle(title: string): void {
    this.pagetitle = title;
  }




  //  ************************************************
  //
  //  ERROR HANDLING
  //
  //

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
