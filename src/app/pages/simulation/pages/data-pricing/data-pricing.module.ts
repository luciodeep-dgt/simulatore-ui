import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgModule } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

import { SharedModule } from './../../../../shared/shared.module';
import { DataPricingRoutingModule } from './data-pricing-routing.module';
import { DataPricingComponent } from './data-pricing.component';
import { DataPricingCalendarComponent } from './data-pricing-calendar/data-pricing-calendar.component';
import { CurveDetailComponent } from './curve-detail/curve-detail.component';
import { CurveDetailCardComponent } from './curve-detail-card/curve-detail-card.component';
import { ChartCurveComponent } from './chart-curve/chart-curve.component';


@NgModule({
  declarations: [
    DataPricingComponent,
    DataPricingCalendarComponent,
    CurveDetailComponent,
    CurveDetailCardComponent,
    ChartCurveComponent
  ],
  imports: [
    DataPricingRoutingModule,
    NgxUiLoaderModule,
    SharedModule
  ],
  providers: [DatePipe, DecimalPipe]
})
export class DataPricingModule { }
