import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RSQLCriteria } from 'rsql-criteria-typescript';
import * as moment from 'moment';

import { Cedola } from './../shared/models/cedola.model';
import { DefaultDataService } from './data.service';
import { Subcategory } from './../shared/models/subcategory.model';
import { Simulation, Curve, Scenario } from '../shared/models';
import { environment } from '../../environments/environment';
import { DownloadService } from './download.service';

const config = { root: environment.baseUrl + '/api' };

@Injectable({
  providedIn: 'root'
})
export class SimulationDataService extends DefaultDataService<Simulation> {

  constructor(protected http: HttpClient,
              private readonly downloadService: DownloadService) {
    super('simulazioni', http, config);
  }

  getLatest(offset: number = 2) {
    const rsql = new RSQLCriteria('filter', 'sort', 'limit', 'totalCount', 'offset');
    rsql.orderBy.add('dataCreazione', 'desc');
    rsql.pageSize = offset;
    const embed = 'cedole,curve,sottocategorie,scenari';
    const query = rsql.build() + '&embed=' + embed;
    return super.getAll(query);
  }

  getSubcategories(simulationId: number | string): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(`${this.resourceUrl}/${simulationId}/sottocategorie`)
    .pipe(
      map((res: any) => {
        res.items = res.items.map((item: Subcategory) => ({
          ...item,
          flagDataPricing: item.modello.flagDataPricing,
          flagParametriBlending: item.modello.flagParametriBlending,
          flagCedole: item.modello.flagCedole
        }));
        return res;
      })
    );
  }

  getCurves(simulationId: number | string): Observable<Curve[]> {
    return this.http.get<Curve[]>(`${this.resourceUrl}/${simulationId}/curve`);
  }

  getCedole(simulationId: number | string): Observable<Cedola[]> {
    return this.http.get<Cedola[]>(`${this.resourceUrl}/${simulationId}/cedole`);
  }

  getScenari(simulationId: number | string): Observable<Scenario[]> {
    return this.http.get<Scenario[]>(`${this.resourceUrl}/${simulationId}/scenari`);
  }

  createByDescription(descrizione: string) {
    return this.http.post<Simulation>(`${this.resourceUrl}`, { descrizione });
  }

  publish(simulationId: number, scenari: number[]) {
    return this.http.post<Simulation>(`${this.resourceUrl}/${simulationId}/publish`, scenari );
  }

  addSubcategories(simulationId: number, sottocategorie: string[]) {
    return this.http.put<boolean>(`${this.resourceUrl}/${simulationId}/sottocategorie`, sottocategorie);
  }

  addBlending(simulationId: number, codiceBlending: string) {
    return this.http.put<void>(`${this.resourceUrl}/${simulationId}/blending/${codiceBlending}`, {});
  }

  associateCurves(simulationId: number, curves: Curve[], dataEmissione: Date) {
    const body = {
      dataEmissione: moment(dataEmissione).format().split('T')[0] as any,
      curve: curves.map(curve => ({
        ...curve,
        idSimulazione: simulationId,
        dettagli: [
          ...curve.dettagli.map(dettaglio => ({ ...dettaglio })),
        ],
        tipologia: curve.tipologia.id
      })),
    };

    return this.http.put<boolean>(`${this.resourceUrl}/${simulationId}/curve`, body);
  }

  printCurve(simulationId: number, curves: Curve[], sottocategorie: Subcategory[]): Observable<HttpResponse<Blob>> {
    const body = curves.map(el => {
      return {
        ...el,
        tipologia: el.tipologia.descrizione,
        sottocategoria: sottocategorie.find(subcategory => subcategory.id === el.idSottocategoria).descrizione
      };
    });
    return this.downloadService.download(
      this.http.post(`${this.resourceUrl}/${simulationId}/curve/print`, body, {
        headers: { Accept: 'application/octet-stream' },
        observe: 'response',
        responseType: 'blob'
      }));
  }

  reportCurve(simulationId: number) {
    return this.downloadService.download(
      this.http.get(`${this.resourceUrl}/${simulationId}/curve/report`, {
        headers: { Accept: 'application/octet-stream' },
        observe: 'response',
        responseType: 'blob'
      }));
  }

  reportScenari(simulationId: number | string) {
    return this.downloadService.download(
      this.http.get(`${this.resourceUrl}/${simulationId}/scenari/report`, {
        headers: { Accept: 'application/octet-stream' },
        observe: 'response',
        responseType: 'blob'
      }));
  }

  setCedole(simulationId: number, cedole: Cedola[], dataEmissione: Date) {
    const body: any = {};
    body.cedole = cedole.map((cedola, index) => ({...cedola, descrizione: 'Scenario Tassi ' + (index + 1), idSimulazione: simulationId}));
    body.dataEmissione = moment(dataEmissione).format().split('T')[0] as any;
    return this.http.put<any>(`${this.resourceUrl}/${simulationId}/cedole`, body);
  }

}
