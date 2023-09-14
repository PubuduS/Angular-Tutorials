import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { UserSettings } from '../data/user-settings';
import { DataService } from '../data/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-settings-form',
  templateUrl: './user-settings-form.component.html',
  styleUrls: ['./user-settings-form.component.css']
})
export class UserSettingsFormComponent implements OnInit {

  originalUserSettings : UserSettings = 
  {
    name: null,
    emailOffers: null,
    interfaceStyle: null,
    subscriptionType: null,
    notes: null
  };

  userSettings : UserSettings =
  {
    ...this.originalUserSettings
  };

  postError = false;
  postErrorMessage = '';
  subscriptionTypes = new Observable<string[]>();

  constructor( private dataService : DataService )
  {}

  ngOnInit(): void 
  {  
    this.subscriptionTypes = this.dataService.getSubscriptionTypes();
  }

  onBlur( field: NgModel )
  {
    console.log( 'in onBlur ', field.valid );
  }

 
  onSubmit( form: NgForm ) 
  {
    console.log( 'in onSubmit ', form.valid );
    console.log( typeof(this.userSettings) );

    if( form.valid )
    {
      this.dataService.postUserSettings( this.userSettings ).subscribe(
      {
        next: (result) => console.log( 'success', JSON.stringify( result ) ),
        error: (error) => this.onHttpError( error )
      }
      );
    }
    else
    {
      this.postError = true;
      this.postErrorMessage = "Please fix the above errors";
    }
  }

  onHttpError( errorResponse: any )
  {
    console.log( 'error: ', JSON.stringify(errorResponse) );
    this.postError = true;
    this.postErrorMessage = errorResponse.error.errorMessage;
  }


}
