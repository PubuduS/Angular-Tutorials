import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, catchError, of, EMPTY } from 'rxjs';

import { ProductService } from './product.service';
import { ProductCategory } from '../product-categories/product-category';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent{
  pageTitle = 'Product List';
  errorMessage = '';
  categories: ProductCategory[] = [];

  products$ = this.productService.productWithCategory$
  .pipe(
    catchError( err => { 
      this.errorMessage = err;
      return EMPTY;

    })
  );

  constructor(private productService: ProductService) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}
