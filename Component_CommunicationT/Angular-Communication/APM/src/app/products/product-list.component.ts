import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';

import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    pageTitle: string = 'Product List';
    showImage: boolean;
    listFilter: string;

    imageWidth: number = 50;
    imageMargin: number = 2;
    errorMessage: string;

    // The goal is to access native html property.
    // To get an access we need to mark the html element with an id with #id format.
    // We added #filterElement to html Input element in template and through that get access
    @ViewChild('filterElement') filterElementRef : ElementRef;
    @ViewChild(NgModel) filterInput: NgModel;

    filteredProducts: IProduct[];
    products: IProduct[];

    constructor(private productService: ProductService) 
    {        
    }

    // We can't access filter element from constructor because at that time componenet is not
    // rendered yet. Therefore we need special lifecycle hook.
    // this method will run after the view is rendered.
    ngAfterViewInit(): void
    {
        // Through native element, we can access html properties such as focus.
        // Native element can pose security risks. eg: cross site scripting attacks.
        // Native element is tightly coupled to the browser.
        // This can also bypass the data sanitation mechanism build into angular.
        // Use as a last resort.
        if( this.filterElementRef.nativeElement )
        {
            this.filterElementRef.nativeElement.focus();
        }

        this.filterInput.valueChanges.subscribe(
            () => this.performFilter( this.listFilter )
        );
    }

    ngOnInit(): void {
        this.productService.getProducts().subscribe(
            (products: IProduct[]) => {
                this.products = products;
                this.performFilter(this.listFilter);
            },
            (error: any) => this.errorMessage = <any>error
        );
    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    performFilter(filterBy?: string): void {
        if (filterBy) {
            this.filteredProducts = this.products.filter((product: IProduct) =>
                product.productName.toLocaleLowerCase().indexOf(filterBy.toLocaleLowerCase()) !== -1);
        } else {
            this.filteredProducts = this.products;
        }
    }
}
