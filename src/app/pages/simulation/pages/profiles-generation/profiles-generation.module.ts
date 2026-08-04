import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgModule } from '@angular/core';
import { ConfirmationService } from 'primeng';

import { ProfilesGenerationRoutingModule } from './profiles-generation-routing.module';
import { ProfilesGenerationComponent } from './profiles-generation.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ScenarioComponent } from './scenario/scenario.component';


@NgModule({
  declarations: [ProfilesGenerationComponent, ScenarioComponent],
  imports: [
    SharedModule,
    ProfilesGenerationRoutingModule,
    NgxUiLoaderModule
  ],
  providers: [ConfirmationService]
})
export class ProfilesGenerationModule { }
