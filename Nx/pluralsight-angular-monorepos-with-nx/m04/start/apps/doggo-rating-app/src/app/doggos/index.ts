import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { isAuthenticated } from '../auth/auth.guard';
import { AddDoggoComponent } from './container/add-doggo/add-doggo.component';
import { MainDoggoComponent } from './container/main-doggo/main-doggo.component';
import { MyDoggosComponent } from './container/my-doggos/my-doggos.component';
import { DoggosEffects } from './store/doggos.effects';
import { doggosReducer } from './store/doggos.reducer';
import { featureName } from './store/doggos.state';

export const DOGGOS_ROUTES: Routes = [
  {
    path: '',
    component: MainDoggoComponent,
    providers: [
      importProvidersFrom(
        StoreModule.forFeature(featureName, doggosReducer),
        EffectsModule.forFeature([DoggosEffects])
      ),
    ],
  },
  {
    path: 'my',
    component: MyDoggosComponent,
    canActivate: [isAuthenticated],
  },
  {
    path: 'my/add',
    component: AddDoggoComponent,
    canActivate: [isAuthenticated],
  },
];
