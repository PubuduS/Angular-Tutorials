import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnChanges, Input, SimpleChanges } from '@angular/core';

@Component({
    selector: 'pm-criteria',
    templateUrl: './criteria.component.html',
    styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit, OnChanges, AfterViewInit {
    
    listFilter: string = 'cart';

    // Input decorator allows parent component to pass values to child.
    // In our parent component template (product-list), we bind this(displayDetail) to
    // parent component property.
    // Through that property, parent component can pass values into this.
    @Input() displayDetail: boolean;
    @Input() hitCount: number;

    hitMessage: string;
    
    // The goal is to access native html property.
    // To get an access we need to mark the html element with an id with #id format.
    // We added #filterElement to html Input element in template and through that get access
    @ViewChild('filterElement') filterElementRef : ElementRef;

    constructor()
    {

    }

    ngOnInit(): void
    {
    }

    // We are watching the changes of Input properties.
    // This method only works with Input.
    // The parameter changes has previous and current value.
    ngOnChanges( changes: SimpleChanges ): void 
    {
        // If hitcount changed and has no values.
        if( changes['hitCount'] && !changes['hitCount'].currentValue )
        {
            this.hitMessage = 'No Matches Found';
        }
        else
        {
            this.hitMessage = 'Hits:' + this.hitCount;
        }
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
    }
}

