import { AuthFailedComponent } from './auth-failed.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { AuthErrorInterceptor } from './auth-error.interceptor';
import { AuthService } from './auth.service';
import { JwtInterceptor } from './jwt.interceptor';
import { AUTH_CONFIG, AuthConfiguration } from './auth.config';
import { AuthCallbackComponent } from './auth-callback.component';


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [AuthCallbackComponent, AuthFailedComponent],
    exports: [AuthCallbackComponent, AuthFailedComponent]
})
export class AuthModule {

    static forRoot(config: AuthConfiguration): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                {
                    provide: AUTH_CONFIG,
                    useValue: config
                },
                AuthGuard,
                AuthService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: JwtInterceptor,
                    multi: true,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthErrorInterceptor,
                    multi: true,
                }
            ]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: AuthModule
        };
    }

}
