import { Injectable, Inject } from '@angular/core';
import {
  HttpInterceptor, HttpRequest,
  HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import * as R from 'ramda';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Logger, APP_LOGGER } from './logger';
import { NotificationService } from './notification.service';


export interface ApiError {
  timestamp: string;
  error: string;
  messages: string[];
  path: string;
}


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(@Inject(APP_LOGGER) private readonly logger: Logger,
              private readonly notificationService: NotificationService,
              private readonly translateService: TranslateService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  handleError(httpError: HttpErrorResponse) {
    let message = this.translateService.instant('ERROR.GENERIC');

    if (httpError.error) {
      const error: ApiError = httpError.error;
      if (!R.isNil(error.messages) && !R.isEmpty(error.messages)) {
        message = R.join('<br>', error.messages);
      }
    }

    this.logger.error('An error has occurred', message);
    this.notificationService.error(message);
    return throwError(httpError);
  }

}
