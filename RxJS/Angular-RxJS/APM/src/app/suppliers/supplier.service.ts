import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError, Observable, of, map, tap, concatMap, mergeMap, switchMap, shareReplay, catchError } from 'rxjs';
import { Supplier } from './supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';

  suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl)
  .pipe(
    tap( data => console.log('suppliers', JSON.stringify(data) ) ),
    shareReplay(1),
    catchError(this.handleError)
  );

  // Normal method (not recommended)
  // Can't bind to template
  // Returns the inner observable not its result
  // Can't use with Async pipe
  suppliersWithMap$ = of( 1, 5, 8 )
  .pipe(
    map( id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`) )
  );

  // This can fix the above problem
  // This will wait for inner observable to complete before going for outer observable.
  // then it will process items in sequence and create new output observable with concatnated values. 
  // See the results in browser console.
  suppliersWithConcatMap$ = of( 1, 5, 8)
  .pipe(
    tap( id=> console.log('ConcatMap source Observable') ),
    concatMap( id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`) )
  );

  // Execute in parallel
  // No order ( first come first serve eg: http requests)
    suppliersWithMergeMap$ = of( 1, 5, 8)
  .pipe(
    tap( id=> console.log('MergeMap source Observable') ),
    mergeMap( id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`) )
  );

  // Unsubscribe previous inner observable and subscribe to the new one.
  // If previous emit before the new outer observable starts, then the result will be merge to
  // output obeservable.
  // Otherwise, it doesn't care about the previous outer observables or their inner observables.
  suppliersWithSwitchMap$ = of( 1, 5, 8)
  .pipe(
    tap( id=> console.log('switchMap source Observable') ),
    switchMap( id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`) )
  );

  constructor(private http: HttpClient) 
  { 

    // Uncomment these lines and run the program and see the console output to understand different maps.

    // this.suppliersWithConcatMap$.subscribe(
    //   item => console.log( 'concatMap result', item )
    // );

    // this.suppliersWithMergeMap$.subscribe(
    //   item => console.log( 'mergeMap result', item )
    // );

    // this.suppliersWithSwitchMap$.subscribe(
    //   item => console.log( 'switchMap result', item )
    // );

    // this.suppliersWithMap$.subscribe( o => o.subscribe(
    //   item => console.log('map result', item)
    // ));
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}
