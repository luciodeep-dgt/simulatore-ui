import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import * as moment from 'moment';

import { DefaultDataService } from './data.service';
import { Curve, Pageable } from '../shared/models';
import { environment } from '../../environments/environment';

const config = { root: environment.baseUrl + '/api' };

@Injectable({
  providedIn: 'root'
})
export class DataPricingService extends DefaultDataService<Curve> {

  constructor(protected http: HttpClient) {
    super('sottocategorie', http, config);
  }

  getByDate(dataPricing: Date, sottocategorie: string[]) {
    const params = new HttpParams({ fromObject: { dataPricing: moment(dataPricing).format().split('T')[0] as any } });
    const requests = sottocategorie
      .map(sottocategoria => {
        return this.http.get<Pageable<Curve>>(`${this.resourceUrl}/${sottocategoria}/scarico-curve`, { params })
          .pipe(
            catchError(err => of({ items: [] }))
          );
      });
    return forkJoin(requests);
  }

}
