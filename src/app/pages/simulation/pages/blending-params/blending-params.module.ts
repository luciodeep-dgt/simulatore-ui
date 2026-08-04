import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedModule } from './../../../../shared/shared.module';

import { BlendingParamsRoutingModule } from './blending-params-routing.module';
import { BlendingParamsComponent } from './blending-params.component';


@NgModule({
  declarations: [BlendingParamsComponent],
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    SharedModule,
    BlendingParamsRoutingModule
  ]
})
export class BlendingParamsModule { }
