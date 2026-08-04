import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import { Scenario, TipoValoreDettaglioScenario, TipoScenario, TipoMaturity } from './../../../../shared/models/scenario.model';
import { environment } from './../../../../../environments/environment';
import { DefaultDataService } from './../../../../core/data.service';
import { DownloadService } from './../../../../core/download.service';


const config = { root: environment.baseUrl + '/api' };

@Injectable({
  providedIn: 'root'
})
export class ScenariService extends DefaultDataService<Scenario> {

  constructor(
    protected http: HttpClient,
    private readonly downloadService: DownloadService
  ) {
    super('scenari', http, config);
  }

  // ci sarà un servizio che restituisce la lista tipologie (esiste la tabella sul db)
  getTipologieScenario(scenario): Observable<TipoScenario[]> {
    const tipologie = scenario.contenitori.map(contenitore => contenitore.tipologia)
    .sort((a, b) => a.codice > b.codice ? 1 : -1);

    return of(tipologie);
  }

  getTipologieValore(): Observable<TipoValoreDettaglioScenario[]> {
    return of([
      {
        codice: 'UPPER',
        descrizione: 'Upper'
      },
      {
        codice: 'MIDDLE',
        descrizione: 'Middle'
      },
      {
        codice: 'LOWER',
        descrizione: 'Lower'
      },
    ]);
  }

  getTipologieMaturity(): Observable<TipoMaturity[]> {
    return of([
      {
        codice: '1M',
        descrizione: 'Mensile'
      },
      {
        codice: '6M',
        descrizione: 'Semestrale'
      },
      {
        codice: '1Y',
        descrizione: 'Annuale'
      },
    ]);
  }

}
