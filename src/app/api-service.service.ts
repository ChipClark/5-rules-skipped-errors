import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, concat } from 'rxjs/operators';

import { Vendor, InvoiceTransaction, InvoiceCheck } from './datatables/data';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public baseURL = 'http://am-web05:3035/api/v1/';  //http://am-web05:3035/api/v1/vendors  
  public tempDATA = '/assets/';
  private vendorFilter = '?filter[order]=vendorname ASC'
  public transactionFilter = "?filter[where][transactionpostdate][gt]=2019-01-01T18:30:00.000Z"
  public debug: boolean;
  public datatype: string;

  constructor( private http: HttpClient ) { }

  setDataLocation() {
    if ( this.datatype == 'local' ) {
      this.baseURL = this.tempDATA;
    }
  }

  getVendor (): Observable<Vendor[]> {
    this.setDataLocation();
    let url = this.baseURL + 'vendors' + this.vendorFilter;
    // if (this.debug == true) console.log(this.baseURL);
    return this.http.get<Vendor[]>(url)
      .pipe(
        tap(people => console.log("API data retrieved successully")),
        catchError(this.handleError('Vendor data', [])),
      );
  }

  getInvoice (): Observable<InvoiceTransaction[]> {
    this.setDataLocation();
    let url = this.baseURL + 'invoicetransactions'+ this.transactionFilter
    // if (this.debug == true) console.log(this.baseURL);
    return this.http.get<InvoiceTransaction[]>(url)
      .pipe(
        tap(people => console.log("API data retrieved successully")),
        catchError(this.handleError('Invoice data', [])),
      );
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
