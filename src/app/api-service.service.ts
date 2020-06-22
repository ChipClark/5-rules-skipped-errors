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
  
  private filter3Years = 'filter[where][lastpayment][gt]=Fri%20Jan%2001%202018%2007:00:00%20GMT-0700%20(Pacific%20Daylight%20Time)'
  private filter5Years = 'filter[where][lastpayment][gt]=Fri%20Jan%2001%202016%2007:00:00%20GMT-0700%20(Pacific%20Daylight%20Time)'

  private orderVendorName = 'filter[order]=vendorname%20ASC';
  private orderInvoiceDate = 'filter[order]=invoicedate%20DESC';
  private lastpaymentFilter = '{"where":{"lastpayment":{"gt":"2017-06-19T23:16:36.635Z"}}';
  private limitYears = ','

  private today = new Date();
  // private threeYearsAgo = this.today - (this.today.getFullYear() - 3);
  private fiveYearsAgo = this.today.getFullYear() - 5;

  
  public transactionFilter = "filter[where][lastpayment][gt]=2017-01-01T18:30:00.000Z"
  
  // http://am-web12:3035/api/v1/invoicetransactions?filter[where][vendoruno]=2047&filter[order]=transactionpostdate
  //http://am-web12:3035/api/v1/invoicetransactions?filter[where][vendoruno]=2047&filter[order]=transactionpostdate&filter[where][invoicedate][gt]==2017-01-01T18:30:00.000Z  
  // public vendorTransactionSearch = 'find({where: {or: [{invoicenarrative: 'search string'}, { vendorname: 'search string'}]}},'
  public debug = true;
  public datatype: string;
  public datedirection = true;
  public sortAmount = true;
  public loadingIndicator = true;

  constructor( private http: HttpClient ) { }

  setDataLocation() {
    if ( this.datatype == 'local' ) {
      this.baseURL = this.tempDATA;
    }
  }

  getVendor (): Observable<Vendor[]> {
    // this.setDataLocation();
    let url = this.baseURL + 'vwvendorinvoicesummaries?' + this.filter3Years + "&" + this.orderVendorName;
    if (this.debug == true) console.log(this.baseURL);
    return this.http.get<Vendor[]>(url)
      .pipe(
        tap(people => {
          console.log("API data retrieved successully")
          this.loadingIndicator = false
        }),
        catchError(this.handleError('Vendor data', [])),
      );
  }

  //   *****************
  //   CURRENTLY NOT IN USE  
  //   *****************
  getInvoice(): Observable<InvoiceTransaction[]> {
    // this.setDataLocation();
    let url = this.baseURL + 'invoicetransactions?'+ this.transactionFilter
    // if (this.debug == true) console.log(this.baseURL);
    let invoiceResults = this.http.get<InvoiceTransaction[]>(url)
      .pipe(
        tap(people => {
          console.log("API data retrieved successully")
          this.loadingIndicator = false
        }),
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
    let url = this.baseURL + 'invoicetransactions?' + 'filter[where][vendoruno]=' + uno;
    url = url + '&[invoicedate][gt]=2017-01-01T18:30:00.000Z' + '&filter[order]=' + orderFilter;
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
    this.loadingIndicator = true;
    searchString = searchString.split(" ").join("%20");
    //  This url does NOT work
    let url = this.baseURL + "vwvendorinvoicetransactions/search?searchterm=" + searchString;
    if (this.debug == true) console.log(url);

    let searchResults =  this.http.get<VendorSearch[]>(url).pipe(
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
