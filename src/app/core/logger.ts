import { InjectionToken } from '@angular/core';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Interfaccia di base logger
 */
export interface Logger {
    debug: any;
    info: any;
    warn: any;
    error: any;
}

export let APP_LOGGER = new InjectionToken<Logger>('Application Logger');
