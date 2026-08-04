import { AuthFailedComponent } from './auth/auth-failed.component';
import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthCallbackComponent } from './auth/auth-callback.component';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard],
    data: {
      permissions: {
        only: ['OPERATORE', 'VALIDATORE', 'ADMIN', 'SUPERADMIN'],
      },
    }
  },
  {
    path: 'simulazione',
    loadChildren: () => import('./pages/simulation/simulation.module').then(m => m.SimulationModule),
    canActivate: [AuthGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['OPERATORE', 'VALIDATORE', 'ADMIN', 'SUPERADMIN'],
      },
    }
  },
  {
    path: 'auth-callback',
    component: AuthCallbackComponent
  },
  {
    path: 'autenticazione',
    component: AuthFailedComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
