import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Logger } from './logger';

export let isDebugMode = !environment.production;

const noop = (): any => undefined;

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service per il logging in console
 */
@Injectable()
export class ConsoleLoggerService implements Logger {

  get debug() {
    if (isDebugMode) {
      // tslint:disable-next-line:no-console
      return console.debug.bind(console);
    } else {
      return noop;
    }
  }

  get info() {
    if (isDebugMode) {
      // tslint:disable-next-line:no-console
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (isDebugMode) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (isDebugMode) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

  invokeConsoleMethod(type: string, args?: any): void {
    const logFn = (console)[type] || console.log || noop;
    logFn.apply(console, [args]);
  }
}
