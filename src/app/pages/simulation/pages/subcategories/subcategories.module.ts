import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubcategoriesRoutingModule } from './subcategories-routing.module';
import { SubcategoriesComponent } from './subcategories.component';
import { SubcategoriesListComponent } from './subcategories-list/subcategories-list.component';


@NgModule({
  declarations: [SubcategoriesComponent, SubcategoriesListComponent],
  imports: [
    CommonModule,
    SubcategoriesRoutingModule,
    NgxUiLoaderModule,
    SharedModule
  ]
})
export class SubcategoriesModule { }
