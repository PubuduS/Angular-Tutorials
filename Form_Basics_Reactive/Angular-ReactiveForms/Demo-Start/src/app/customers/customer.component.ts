import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

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

  emailMessage: string;

  get addresses(): FormArray
  {
    return <FormArray>this.customerForm.get('addresses');
  }

  private validationMessage = 
  {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };

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
          sendCatalog: true,

          addresses: this.fb.array([ this.buildAddress() ])
        }
    );

    this.customerForm.get('notification').valueChanges.subscribe(
      value => this.setNotification( value )
    );

    const emailControl = this.customerForm.get( 'emailGroup.email' );
    emailControl.valueChanges.pipe( debounceTime(2000) ).subscribe(
      value => this.setMessage( emailControl )
    );

  }

  // When the user need to add another address, this will create new formGroup for that.
  addAddress(): void
  {
    this.addresses.push( this.buildAddress() );
  }

  buildAddress(): FormGroup
  {
    return this.fb.group
    (
      {
        addressType: 'home',
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: ''
      }
    )
  }

  populateTestData(): void
  {
    this.customerForm.patchValue(
      {
        firstName: 'Jack',
        lastName: 'Harkness',
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

  setMessage( c: AbstractControl ): void
  {

    this.emailMessage = '';
    
    if( ( c.touched || c.dirty ) && c.errors )
    {
      this.emailMessage = Object.keys( c.errors ).map(
        key => this.validationMessage[key] ).join('');      
    }

  }

}
