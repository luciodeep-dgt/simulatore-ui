import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PaddingsPipe } from './../../../../shared/pipes/paddings.pipe';
import { SharedModule } from './../../../../shared/shared.module';

import { CedoleRoutingModule } from './cedole-routing.module';
import { CedoleComponent } from './cedole.component';
import { AddCedoleFormComponent } from './add-cedole-form/add-cedole-form.component';
import { CedoleListComponent } from './cedole-list/cedole-list.component';
import { CedolaFormComponent } from './cedola-form/cedola-form.component';
import { CedoleListTableComponent } from './cedole-list-table/cedole-list-table.component';
import { ThoDigitPipe } from 'src/app/shared/pipes/two-digit-paddings.pipe';


@NgModule({
  declarations: [CedoleComponent, AddCedoleFormComponent, CedoleListComponent, CedolaFormComponent, CedoleListTableComponent],
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    SharedModule,
    CedoleRoutingModule
  ],
  providers: [PaddingsPipe,ThoDigitPipe]
})
export class CedoleModule { }
