import { StepGuard } from './step.guard';
import { ResolverGuard } from './../../core/resolver.guard';
import { SimulationResolver } from './simulation.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimulationComponent } from './simulation.component';


const routes: Routes = [
  {
    path: ':id',
    component: SimulationComponent,
    canActivate: [ResolverGuard],
    canDeactivate: [ResolverGuard],
    children: [
      {
        path: 'sottocategorie',
        loadChildren: () => import('./pages/subcategories/subcategories.module').then(m => m.SubcategoriesModule),
        canActivate: [StepGuard]
      },
      {
        path: 'data-pricing',
        loadChildren: () => import('./pages/data-pricing/data-pricing.module').then(m => m.DataPricingModule),
        canActivate: [StepGuard]
      },
      {
        path: 'parametri-blending',
        loadChildren: () => import('./pages/blending-params/blending-params.module').then(m => m.BlendingParamsModule),
        canActivate: [StepGuard]
      },
      {
        path: 'cedole',
        loadChildren: () => import('./pages/cedole/cedole.module').then(m => m.CedoleModule),
        canActivate: [StepGuard]
      },
      {
        path: 'profili-generati',
        loadChildren: () => import('./pages/profiles-generation/profiles-generation.module').then(m => m.ProfilesGenerationModule),
        canActivate: [StepGuard]
      },
      // {
      //   path: '',
      //   redirectTo: 'sottocategorie'
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SimulationResolver]
})
export class SimulationRoutingModule { }
