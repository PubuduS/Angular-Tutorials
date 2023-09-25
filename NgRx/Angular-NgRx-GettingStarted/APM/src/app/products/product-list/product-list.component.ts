import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { State, getCurrentProduct, getShowProductCode } from '../state/product.reducer';
import * as ProductAction from '../state/product.actions';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage: string;

  displayCode: boolean;

  products: Product[];

  // Used to highlight the selected product in the list
  selectedProduct: Product | null;
  sub: Subscription;

  constructor( private store: Store<State>,
    private productService: ProductService) { }

  ngOnInit(): void {

    // this.sub = this.productService.selectedProductChanges$.subscribe(
    //   currentProduct => this.selectedProduct = currentProduct
    // );

    // ToDo: Unsubscribe
    // Previous function commented out in above use service.
    // This new function use store to communicate multiple components.
    this.sub = this.store.select(getCurrentProduct).subscribe(
      currentProduct => this.selectedProduct = currentProduct
    );

    this.productService.getProducts().subscribe({
      next: (products: Product[]) => this.products = products,
      error: err => this.errorMessage = err
    });

    // ToDo: Unsubscribe
    this.store.select(getShowProductCode).subscribe(
      showProductCode => this.displayCode = showProductCode
    );
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
    this.store.dispatch( ProductAction.setCurrentProduct( {product} ) );
  }

}
