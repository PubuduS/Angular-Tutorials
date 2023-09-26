import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { Product } from '../product';
import { State, getCurrentProduct, getError, getProducts, getShowProductCode } from '../state/product.reducer';
import * as ProductAction from '../state/product.actions';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';

  displayCode: boolean;

  products$: Observable<Product[]>;

  sub: Subscription;
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
    this.products$ = this.store.select(getProducts);

    this.errorMessage$ = this.store.select( getError );

    this.store.dispatch( ProductAction.loadProducts() );

    this.selectedProduct$ = this.store.select(getCurrentProduct);


    this.displayCode$ = this.store.select(getShowProductCode);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  checkChanged(): void {
    this.store.dispatch( ProductAction.toggleProductCode() );
  }

  newProduct(): void {
    this.store.dispatch( ProductAction.initializeCurrentProduct() );
  }

  productSelected(product: Product): void 
  {    
    // {product} is a short-hand operator. This is same as {product: product}
    // left is param and right is function args here -> props< { product: Product } >()
    this.store.dispatch( ProductAction.setCurrentProduct( {currentProductId: product.id} ) );
  }

}
