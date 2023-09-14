import { Injectable } from '@angular/core';
import { UserSettings } from './user-settings';
import { Observable, of, map} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor( private http: HttpClient ) 
  { }

  getSubscriptionTypes(): Observable<string[]> 
  {
    return of(['Monthly', 'Annual', 'Lifetime']);
  }


  postUserSettings( userSettngs: UserSettings ) : Observable<any>
  {
    console.log('Inside data service: sending... ' + typeof( userSettngs )  );

    /*
    return this.http.post('https://putsreq.com/T2kv0Ecem1IXQaZBQ57o', userSettngs )
    .pipe(
      map( (response)=> {
        console.log(response);
        return response;
      })
    );
    */

    return this.http.post('https://eo45zjbhai21jzi.m.pipedream.net', userSettngs );

    //return of( userSettngs );
  }
}
