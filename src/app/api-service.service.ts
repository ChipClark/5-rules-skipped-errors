import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, concat } from 'rxjs/operators';

import { Vendor } from './datatables/vendor';


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  public baseURL = 'http://am-web05:3040/api/v1/'; 

  constructor( private http: HttpClient ) { }

  getDATA (url): Observable<Vendor[]> {
    url = this.baseURL + url;
    // if (this.debug == true) console.log(url);
    return this.http.get<Vendor[]>(url)
      .pipe(
        tap(people => console.log("API data retrieved successully")),
        catchError(this.handleError('getPeople', [])),
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
