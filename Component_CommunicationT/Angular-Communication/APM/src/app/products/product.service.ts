import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';

import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { IProduct } from './product';

@Injectable()
export class ProductService {
    private productsUrl = 'api/products';
    private products: IProduct[];

    // Use multicast to announce changes to multiple subscribers.
    private selectedProductSource = new BehaviorSubject<IProduct | null >( null );

    // Expose the above private property as a public read only observable stream
    selectedProductChanges$ = this.selectedProductSource.asObservable();

    constructor(private http: HttpClient) { }

    // Everytime a change happened, we add that to observable stream
    changeSelectedProduct( selectedProduct: IProduct | null  ): void
    {
        this.selectedProductSource.next( selectedProduct );
    }

    getProducts(): Observable<IProduct[]> 
    {
        if( this.products )
        {            
            return of( this.products );           
        }
        
        return this.http.get<IProduct[]>(this.productsUrl)
                        .pipe(
                            tap(data => console.log(JSON.stringify(data))),
                            tap( data => this.products = data ),
                            catchError(this.handleError)
                        );
    }

    getProduct(id: number): Observable<IProduct> {
        if (id === 0) {
            return of(this.initializeProduct());
        }
        
        if( this.products )
        {
            // This is a reference
            // So, if we update the product, this will reflect new changes
            // We don't have to flush the old cache and put new cache.
            const foundItem = this.products.find( item => item.id === id );
            
            if( foundItem )
            {
                return of( foundItem );
            }
        }

        const url = `${this.productsUrl}/${id}`;
        return this.http.get<IProduct>(url)
                        .pipe(
                            tap(data => console.log('Data: ' + JSON.stringify(data))),
                            catchError(this.handleError)
                        );
    }

    saveProduct(product: IProduct): Observable<IProduct> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (product.id === 0) {
            return this.createProduct(product, headers);
        }
        return this.updateProduct(product, headers);
    }

    deleteProduct(id: number): Observable<IProduct> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        const url = `${this.productsUrl}/${id}`;
        return this.http.delete<IProduct>(url, { headers: headers} )
                        .pipe(
                            tap(data => console.log('deleteProduct: ' + id)),
                            tap( data => {

                                const foundIndex = this.products.findIndex( item => item.id === id );
                                
                                if( foundIndex > -1 )
                                {
                                    this.products.splice( foundIndex, 1 );
                                    this.changeSelectedProduct( null );
                                }

                            } ),
                            catchError(this.handleError)
                        );
    }

    private createProduct(product: IProduct, headers: HttpHeaders): Observable<IProduct> {
        
        // In memory web api requires a null so 
        // it can assign id automatically.
        product.id = null;
        return this.http.post<IProduct>(this.productsUrl, product,  { headers: headers} )
                        .pipe(
                            tap(data => console.log('createProduct: ' + JSON.stringify(data))),
                            tap( data => {
                                this.products.push( data ),
                                this.changeSelectedProduct( data );
                            }),
                            catchError(this.handleError)
                        );
    }

    private updateProduct(product: IProduct, headers: HttpHeaders): Observable<IProduct> {
        const url = `${this.productsUrl}/${product.id}`;
        return this.http.put<IProduct>(url, product, { headers: headers} )
                        .pipe(
                            tap(data => console.log('updateProduct: ' + product.id)),
                            catchError(this.handleError)
                        );
    }

    private initializeProduct(): IProduct {
        // Return an initialized object
        return {
            'id': 0,
            productName: '',
            productCode: '',
            category: '',
            tags: [],
            releaseDate: '',
            price: 0,
            description: '',
            starRating: 0,
            imageUrl: ''
        };
    }

    private handleError(err: HttpErrorResponse): ErrorObservable {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage: string;
        if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Backend returned code ${err.status}, body was: ${err.error}`;
        }
        console.error(err);
        return new ErrorObservable(errorMessage);
    }

}
