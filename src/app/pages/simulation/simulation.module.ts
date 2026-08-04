import { StepGuard } from './step.guard';
import { ResolverGuard } from './../../core/resolver.guard';
import { SimulationService } from './simulation.service';
import { CurveEditDialogComponent } from './pages/data-pricing/curve-edit-dialog/curve-edit-dialog.component';
import { DialogService } from 'primeng';
import { SimulationStatusDialogComponent } from './components/simulation-status-dialog/simulation-status.dialog.component';
import { SimulationStore } from './simulation.store';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SimulationRoutingModule } from './simulation-routing.module';
import { SimulationComponent } from './simulation.component';
import { SimulationBannerComponent } from './components/simulation-banner/simulation-banner.component';
import { SimulationStepperComponent } from './components/simulation-stepper/simulation-stepper.component';


@NgModule({
  declarations: [
    SimulationComponent,
    SimulationBannerComponent,
    SimulationStepperComponent,
    SimulationStatusDialogComponent,
    CurveEditDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SimulationRoutingModule
  ],
  entryComponents: [
    CurveEditDialogComponent,
    SimulationStatusDialogComponent
  ],
  providers: [
    SimulationStore,
    SimulationService,
    DialogService,
    DatePipe,
    ResolverGuard,
    StepGuard
  ]
})
export class SimulationModule { }
