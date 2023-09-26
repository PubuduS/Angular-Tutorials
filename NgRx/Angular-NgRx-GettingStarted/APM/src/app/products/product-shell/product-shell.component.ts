import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { Product } from '../product';
import { State, getCurrentProduct, getError, getProducts, getShowProductCode } from '../state';
import { ProductPageActions } from '../state/actions';


@Component({
  templateUrl: './product-shell.component.html'
})
export class ProductShellComponent implements OnInit {

  displayCode: boolean;

  products$: Observable<Product[]>;

  selectedProduct$: Observable<Product>;
  displayCode$: Observable<boolean>;
  errorMessage$: Observable<string>;

  constructor( private store: Store<State>)
  { 
  }

  ngOnInit(): void {

    // this.sub = this.productService.selectedProductChanges$.subscribe(
    //   currentProduct => this.selectedProduct = currentProduct
    // );


     // Previous function commented out in above use service.
    // This new function use store to communicate multiple components.
    
    this.store.dispatch( ProductPageActions.loadProducts() );

    this.products$ = this.store.select(getProducts);

    this.errorMessage$ = this.store.select( getError );    

    this.selectedProduct$ = this.store.select(getCurrentProduct);

    this.displayCode$ = this.store.select(getShowProductCode);
  }

  checkChanged(): void {
    this.store.dispatch( ProductPageActions.toggleProductCode() );
  }

  newProduct(): void {
    this.store.dispatch( ProductPageActions.initializeCurrentProduct() );
  }

  productSelected(product: Product): void 
  {    
    // {product} is a short-hand operator. This is same as {product: product}
    // left is param and right is function args here -> props< { product: Product } >()
    this.store.dispatch( ProductPageActions.setCurrentProduct( {currentProductId: product.id} ) );
  }

}
