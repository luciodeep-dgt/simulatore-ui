import { SimulationResolver } from './pages/simulation/simulation.resolver';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { NgxPermissionsModule } from 'ngx-permissions';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { APP_LOGGER } from './core/logger';
import { BROWSER_STORAGE } from './core/browser-storage.service';
import { ConsoleLoggerService } from './core/console-logger.service';
import { dataServices } from './core/data-services';
import { environment } from '../environments/environment';
import { ErrorInterceptor } from './core/error.interceptor';
import { LocaleInterceptor } from './core/locale.interceptor';
import { HttpLoaderFactory } from './core/locale.service';
import { SharedModule } from './shared/shared.module';
import { AUTH_PROVIDER } from './auth/auth-provider';
import { AdfsAuthProvider, ADFS_CONFIG } from './core/adfs-authprovider.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule.forRoot({
      session_storage_key: environment.session_storage_key,
    }),
    NgxPermissionsModule.forRoot(),
    NgxUiLoaderModule.forRoot({
      bgsColor: '#06c',
      fgsColor: '#06c',
      pbColor: '#06c',
      overlayColor: 'rgba(40,40,40,0.3)'
    }),
    NgxUiLoaderRouterModule,
    SharedModule,
    HttpClientModule,
    TranslateModule.forRoot({
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: APP_LOGGER,
      useClass: ConsoleLoggerService
    },
    {
      provide: ADFS_CONFIG,
      useValue: {...environment.adfs}
    },
    {
      provide: AUTH_PROVIDER,
      useClass: AdfsAuthProvider
    },
    {
      provide: BROWSER_STORAGE,
      useValue: sessionStorage,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LocaleInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: environment.locale,
    },
    NgxUiLoaderService,
    ...dataServices,
    SimulationResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
