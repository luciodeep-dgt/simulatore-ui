import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlendingParamsComponent } from './blending-params.component';


const routes: Routes = [
  {
    path: '',
    component: BlendingParamsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlendingParamsRoutingModule { }
