import { ToStringPipe } from './pipes/to-string.pipe';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageModule } from 'primeng/message';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { HttpLoaderFactory } from '../core/locale.service';
import { HeaderComponent } from './components/header/header.component';
import { MessagesComponent } from './components/messages/messages.component';
import { AuthModule } from '../auth/auth.module';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ErrorPanelComponent } from './components/error-panel/error-panel.component';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { InfoPopupComponent } from './components/info-popup/info-popup.component';
import { InitialsPipe } from './pipes/initials.pipe';
import { IMaskModule } from 'angular-imask';
import { PaddingsPipe } from './pipes/paddings.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ThoDigitPipe } from './pipes/two-digit-paddings.pipe';


@NgModule({
  declarations: [
    HeaderComponent, MessagesComponent,
    SideMenuComponent, ErrorPanelComponent, InfoCardComponent, InfoPopupComponent,
    EllipsisPipe, InitialsPipe, ToStringPipe, ThoDigitPipe, PaddingsPipe
  ],
  entryComponents: [],
  imports: [
    AuthModule.forChild(),
    AccordionModule,
    FlexLayoutModule,
    AutoCompleteModule,
    FileUploadModule,
    ButtonModule,
    TabViewModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    InputMaskModule,
    CommonModule,
    RadioButtonModule,
    CalendarModule,
    CardModule,
    ChartModule,
    ColorPickerModule,
    CheckboxModule,
    FormsModule,
    IMaskModule,
    MenuModule,
    MessageModule,
    NgxPermissionsModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    PaginatorModule,
    RatingModule,
    ReactiveFormsModule,
    StepsModule,
    TableModule,
    ToastModule,
    TooltipModule,
    TranslateModule.forChild({
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    AccordionModule,
    AutoCompleteModule,
    CalendarModule,
    FlexLayoutModule,
    StepsModule,
    EllipsisPipe,
    InitialsPipe,
    PaddingsPipe,
    ThoDigitPipe,
    RadioButtonModule,
    ButtonModule,
    FileUploadModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    InputMaskModule,
    MenuModule,
    CardModule,
    MessageModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    RatingModule,
    ColorPickerModule,
    CheckboxModule,
    TableModule,
    ToStringPipe,
    TabViewModule,
    ChartModule,
    IMaskModule,
    PaginatorModule,
    TooltipModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    HeaderComponent,
    MessagesComponent,
    SideMenuComponent,
    ErrorPanelComponent,
    ReactiveFormsModule,
    InfoCardComponent,
    InfoPopupComponent,
    NgxPermissionsModule
  ]
})
export class SharedModule { }
