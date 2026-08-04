import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pageable } from '../shared/models';

export interface QueryParams {
  [name: string]: string | string[];
}

export function dataServiceFactory<T>(resourceName: string, http: HttpClient, config?: any): DefaultDataService<T> {
  return new DefaultDataService<T>(resourceName, http, config);
}

export interface DataService<T> {
  readonly resourceName: string;
  add(resource: T): Observable<T>;
  delete(id: number | string): Observable<number | string>;
  getAll(params?: QueryParams | string): Observable<Pageable<T>>;
  getById(id: number | string): Observable<T>;
  update(id: number | string, resource: Partial<T>): Observable<T>;
  upsert(resource: T): Observable<T>;
}

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service per la persistence delle risorse
 * Assume una comune REST-y web API
 */
export class DefaultDataService<T> implements DataService<T> {

  protected resourceUrl: string;

  constructor(
    public resourceName: string,
    protected http: HttpClient,
    config?: any
  ) {
    const { root = 'api' } = config || {};
    this.resourceUrl = this.generateHttpUrl(resourceName, root);
  }

  add(resource: T): Observable<T> {
    return this.http.post<T>(`${this.resourceUrl}`, resource);
  }

  delete(id: string | number): Observable<string | number> {
    return this.http.delete(`${this.resourceUrl}/${id}`)
      .pipe(map(_ => id));
  }

  getAll(queryParams?: QueryParams | string): Observable<Pageable<T>> {
    const qParams = typeof queryParams === 'string' ? { fromString: queryParams } : { fromObject: queryParams };
    const params = new HttpParams(qParams);
    return this.http.get<Pageable<T>>(`${this.resourceUrl}`, { params });
  }

  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.resourceUrl}/${id}`);
  }

  update(id: number | string, resource: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.resourceUrl}/${id}`, resource);
  }

  upsert(resource: T): Observable<T> {
    return this.http.post<T>(`${this.resourceUrl}`, resource);
  }

  protected generateHttpUrl(resourceName: string, root: string | any) {
    /** Remove leading & trailing spaces or slashes */
    return `${root}/${resourceName}`.toLowerCase();
  }
}

