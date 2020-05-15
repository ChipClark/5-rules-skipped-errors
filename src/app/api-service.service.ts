import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, concat } from 'rxjs/operators';

import { Vendor, VendorSearch, InvoiceTransaction, InvoiceCheck } from './datatables/data';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public baseURL = 'http://am-web12:3035/api/v1/';  //http://am-web05:3035/api/v1/vendors  am-web12:3035
  public tempDATA = '/assets/';
  private vendorFilter = 'filter[order]=vendorname ASC'
  public transactionFilter = "filter[where][transactionpostdate][gt]=2019-01-01T18:30:00.000Z"
  // public vendorTransactionSearch = 'find({where: {or: [{invoicenarrative: 'search string'}, { vendorname: 'search string'}]}},'
  public debug: boolean;
  public datatype: string;
  public datedirection = true;
  public sortAmount = true;

  constructor( private http: HttpClient ) { }

  setDataLocation() {
    if ( this.datatype == 'local' ) {
      this.baseURL = this.tempDATA;
    }
  }

  getVendor (): Observable<Vendor[]> {
    this.setDataLocation();
    let url = this.baseURL + 'vendortransactions?' + this.vendorFilter;
    // if (this.debug == true) console.log(this.baseURL);
    return this.http.get<Vendor[]>(url)
      .pipe(
        tap(people => console.log("API data retrieved successully")),
        catchError(this.handleError('Vendor data', [])),
      );
  }

  getInvoice(): Observable<InvoiceTransaction[]> {
    this.setDataLocation();
    let url = this.baseURL + 'invoicetransactions?'+ this.transactionFilter
    // if (this.debug == true) console.log(this.baseURL);
    let invoiceResults = this.http.get<InvoiceTransaction[]>(url)
      .pipe(
        tap(people => console.log("API data retrieved successully")),
        catchError(this.handleError('Invoice data', [])),
      );
    if (this.debug == true) console.log(invoiceResults);
    return invoiceResults;
  }

  getInvoiceByUno(uno: number, sort: string): Observable<InvoiceTransaction[]> {

    // ?filter[where][and][1][vendoruno]=8555&filter[where][and][1][transactionpostdate][gt]=2020-04-01T18:30:00.000Z
    this.setDataLocation();
    var orderFilter;
    switch (sort) {
      case 'date':
        this.datedirection = !this.datedirection;
        if ( this.datedirection == false ) {
          orderFilter = 'transactionpostdate asc';  
        }
        else {
          orderFilter = 'transactionpostdate desc'; 
        }
        break;
      case 'amount':
        this.sortAmount = !this.sortAmount;
        if ( this.sortAmount == false ) {
          orderFilter = 'invoiceamount asc';
        }
        else {
          orderFilter = 'invoiceamount desc';
        }
        break;
    }
    let url = this.baseURL + 'invoicetransactions?' + 'filter[where][vendoruno]=' + uno + '&filter[order]=' + orderFilter; 
    // + uno + this.transactionFilter;
    if (this.debug == true) console.log(url);
    return this.http.get<InvoiceTransaction[]>(url)
      .pipe(
        tap(transactions => console.log("API data retrieved successully")),
        catchError(this.handleError('Invoice data', [])),
      );
  }

  getVendorTransactionBySearch(searchString: string): Observable<any> {
    this.setDataLocation();
    
    //  This url does NOT work
    let url = this.baseURL + "vwvendortransactionsearches?" + 'find({where: {or: [{invoicenarrative: ' + "'" + searchString + "'" + '}, { vendorname: ' + "'" + searchString + "'" + '}]}},' ;


    let searchResults = this.http.get<VendorSearch[]>(url)
    if (this.debug == true) console.log(searchResults);
    
    return searchResults;
  }

  getCheck (): Observable<InvoiceCheck[]> {
    this.setDataLocation();
    this.baseURL += 'invoicecheck';
    // if (this.debug == true) console.log(this.baseURL);
    return this.http.get<InvoiceCheck[]>(this.baseURL)
      .pipe(
        tap(people => console.log("API data retrieved successully")),
        catchError(this.handleError('InvoiceCheck data', [])),
      );
  }


  //  ************************************************
  //  ERROR HANDLING  

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
