import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { LocaleService } from './locale.service';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Interceptor per invio preferenza locale
 */
@Injectable()
export class LocaleInterceptor implements HttpInterceptor {

  constructor(private readonly localeService: LocaleService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.localeService.getLocale()
      .pipe(
          take(1),
          map((locale: string) => request.clone({
              setHeaders: { 'Accept-Language' : locale }
            })
          ),
          switchMap((req) => next.handle(req))
      );
  }
}
