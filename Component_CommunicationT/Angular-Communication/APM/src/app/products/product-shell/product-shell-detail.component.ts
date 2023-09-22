import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { IProduct } from '../product';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'pm-product-shell-detail',
    templateUrl: './product-shell-detail.component.html'
})
export class ProductShellDetailComponent implements OnInit, OnDestroy {
    pageTitle: string = 'Product Detail';

    // This will not work, actually it will run but only one time.
    // We need this to run every time when we detect changes.
    // Therefore, a getter is thr right solution here.
    // product: IProduct = this.productService.currentProduct;

    // Angular change detection will pick the value when it changed.
    // get product(): IProduct | null
    // {
    //     return this.productService.currentProduct;
    // }

    product: IProduct | null;
    sub: Subscription;

    constructor(private productService: ProductService) { }

    // Subscribe for Subject notification.
    // Each time it annouce a change, we the get that and pass it to template.
    ngOnInit() 
    {
        this.sub = this.productService.selectedProductChanges$.subscribe(
            selectedProduct => this.product = selectedProduct
        );
    }

    ngOnDestroy(): void 
    {
        this.sub.unsubscribe();
    }

}
