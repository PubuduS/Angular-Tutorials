import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { IProduct } from '../product';

@Component({
    selector: 'pm-product-shell-detail',
    templateUrl: './product-shell-detail.component.html'
})
export class ProductShellDetailComponent implements OnInit {
    pageTitle: string = 'Product Detail';

    // This will not work, actually it will run but only one time.
    // We need this to run every time when we detect changes.
    // Therefore, a getter is thr right solution here.
    // product: IProduct = this.productService.currentProduct;

    // Angular change detection will pick the value when it changed.
    get product(): IProduct | null
    {
        return this.productService.currentProduct;
    }

    constructor(private productService: ProductService) { }

    ngOnInit() {
    }

}
