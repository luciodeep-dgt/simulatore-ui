import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as moment from 'moment';

import { DownloadService } from './../../../../core/download.service';
import { DefaultDataService } from './../../../../core/data.service';
import { Cedola, Pageable } from './../../../../shared/models';
import { environment } from '../../../../../environments/environment';

const config = { root: environment.baseUrl + '/api' };

@Injectable({ providedIn: 'root' })
export class CedoleService extends DefaultDataService<Cedola> {

  constructor(
    protected http: HttpClient,
    private readonly downloadService: DownloadService
  ) {
    super('cedole', http, config);
  }

  upload(file: File): Observable<any> {
    const form = new FormData();
    form.append('file', file, file.name);

    return this.http.post<any>(`${this.resourceUrl}/parse`, form)
      .pipe(map(response => response));
  }

  downloadCedole(idSimulazione: number, cedola: Cedola) {
    const body = {...cedola, idSimulazione};
    return this.downloadService.download(
      this.http.post(`${this.resourceUrl}/print`, body, {
        headers: { Accept: 'application/octet-stream' },
        observe: 'response',
        responseType: 'blob'
      }));
  }

}
