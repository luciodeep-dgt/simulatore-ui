import { InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { dataServiceFactory } from './data.service';
import { Subcategory, SimulationStatus, BlendingParam, TaxType } from '../shared/models';

export const TAX_TYPE_SERVICE = new InjectionToken<string>('Tax Type DataService');
export const SIMULATION_STATUS_SERVICE = new InjectionToken<string>('SimulationStatus DataService');
export const BLENDINGS_SERVICE = new InjectionToken<string>('Blendings DataService');


const config = { root: environment.baseUrl + '/api' };

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Raggruppa svariati data services
 */
export const dataServices = [
  {
    provide: SIMULATION_STATUS_SERVICE,
    useFactory: (http) => dataServiceFactory<SimulationStatus>('stati-simulazione', http, config),
    deps: [HttpClient]
  },
  {
    provide: BLENDINGS_SERVICE,
    useFactory: (http) => dataServiceFactory<BlendingParam>('blending', http, config),
    deps: [HttpClient]
  },
  {
    provide: TAX_TYPE_SERVICE,
    useFactory: (http) => dataServiceFactory<TaxType>('tipo-tassi', http, config),
    deps: [HttpClient]
  },
];

