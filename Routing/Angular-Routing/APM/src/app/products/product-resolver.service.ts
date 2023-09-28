import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

import { ProductResolved } from './product';
import { ProductService } from './product.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })

export class ProductResolver implements Resolve<ProductResolved>
{
    constructor(private productService: ProductService )
    {}

    // We don't subscribe here. Resolver manages it for us.
    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductResolved> {        
        const id = Number( route.paramMap.get('id') );

        if (isNaN(id)) {
            const message = `Product id was not a number: ${id}`;
            console.error(message);
            return of({ product: null, error: message });
          }

          return this.productService.getProduct(id)
          .pipe(
            map(product => ({ product, error: '' })),
            catchError(error => {
              const message = `Retrieval error: ${error}`;
              console.error(message);
              return of({ product: null, error: message });
            })
          );
    }
}