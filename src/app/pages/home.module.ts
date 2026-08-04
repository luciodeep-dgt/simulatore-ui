import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DialogService, ConfirmationService } from 'primeng';

import { SharedModule } from './../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CreateSimulationDialogComponent } from './components/create-simulation-dialog/create-simulation.dialog.component';
import { LastSimulationsComponent } from './components/last-simulations/last-simulations.component';
import { SimulationsListComponent } from './components/all-simulations/simulations-list/simulations-list.component';
import { AddSimulationCardComponent } from './components/add-simulation-card/add-simulation-card.component';
import { SimulationCardComponent } from './components/last-simulations/simulation-card/simulation-card.component';
import { AllSimulationsComponent } from './components/all-simulations/all-simulations.component';



@NgModule({
  declarations: [
    HomeComponent,
    LastSimulationsComponent,
    SimulationsListComponent,
    AddSimulationCardComponent,
    SimulationCardComponent,
    AllSimulationsComponent,
    CreateSimulationDialogComponent
  ],
  imports: [
    NgxUiLoaderModule,
    SharedModule,
    HomeRoutingModule
  ],
  entryComponents: [
    CreateSimulationDialogComponent
  ],
  providers: [
    ConfirmationService,
    DialogService,
    DatePipe
  ]
})
export class HomeModule { }
