import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Customer } from './customer';

// A normal validator function can only take 1 argument. If we need to pass more 
// args, we need to wrap it in a factory function. We are doing this in below.
// In this way, we can take many arguments and this function return a validator.
function ratingRange( min: number, max: number ): ValidatorFn
{
  return ( c: AbstractControl ): { [key: string]: boolean } | null =>
  {
    if( c.value !== null && ( isNaN( c.value ) || c.value < min || c.value > max ) )
    {
      return { 'range': true };
    }
    return null;
  }
}

function emailMatcher( c: AbstractControl ) : { [key: string] : boolean } | null
{
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if( emailControl.pristine || confirmControl.pristine )
  {
    return null;
  }

  if( emailControl.value === confirmControl.value )
  {
    return null;
  }

  return { 'match': true };
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})

export class CustomerComponent implements OnInit 
{

  customerForm: FormGroup;

  customer = new Customer();

  constructor( private fb: FormBuilder ) { }

  ngOnInit(): void 
  {

    this.customerForm = this.fb.group
    (
        {
          firstName: [ '', [ Validators.required, Validators.minLength( 3 ) ] ],
          lastName: [ '', [ Validators.required, Validators.maxLength( 50 ) ] ],

          emailGroup: this.fb.group({
            email: [ '', [ Validators.required, Validators.email ] ],
            confirmEmail: [ '', [ Validators.required ] ],
          }, { validator: emailMatcher } ),

          phone: '',
          notification: 'email',
          rating: [ null, ratingRange( 1, 5 ) ], 
          sendCatalog: true
        }
    )

  }

  populateTestData(): void
  {
    this.customerForm.patchValue(
      {
        firstName: 'Jack',
        lastName: 'Harkness',
        // email: 'jack@gmail.com',
        //confirmEmail: 'jack@gmail.com',
        emailGroup: { email: 'jack@gmail.com', confirmEmail: 'jack@gmail.com' },
        phone: '',
        notification: 'email',        
        sendCatalog: false
      }
    );
  }

  setNotification( notifyVia: string ): void
  {
    const phoneControl = this.customerForm.get('phone');

    if( notifyVia === 'text' )
    {
      phoneControl.setValidators( Validators.required );
    }
    else
    {
      phoneControl.clearValidators();
    }

    phoneControl.updateValueAndValidity();
  }

  save(): void {
    console.log( this.customerForm );
    console.log( 'Saved: ' + JSON.stringify( this.customerForm.value ) );
  }
}
