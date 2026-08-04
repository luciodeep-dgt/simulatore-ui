import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BrowserStorageService } from '../core/browser-storage.service';
import { AuthConfiguration, AUTH_CONFIG } from './auth.config';
import { environment } from '../../environments/environment';
import * as R from 'ramda';
import { AuthProvider, AUTH_PROVIDER } from './auth-provider';
import { Token, User } from './user';

const capitalize = R.replace(/^./, R.toUpper);


/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service per l'autenticazione
 */
@Injectable()
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser$: Observable<User>;

  constructor(
    @Inject(AUTH_PROVIDER) private readonly authProvider: AuthProvider,
    @Inject(AUTH_CONFIG) private readonly config: AuthConfiguration,
    private readonly browserStorage: BrowserStorageService,
    private readonly http: HttpClient) {

    const user: User = this.deserialize(browserStorage.get(config.session_storage_key));
    this.currentUserSubject = new BehaviorSubject<User>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user: User) => user ? !!user.accessToken : false)
    );
  }

  getClaims(): any {
    return this.currentUser$.pipe(map((user) => user.profile));
  }

  getHeaders() {
    return of(this.deserialize(this.browserStorage.get('token')))
      .pipe(
        map((token: Token) => !token ? {} : {
          Authorization: `${capitalize(token.token_type)} ${token.access_token}`
        })
      );
  }

  startAuthentication() {
    return this.authProvider.signinRedirect();
  }

  completeAuthentication() {
    return this.authProvider.signinRedirectCallback()
      .pipe(
        tap((token: Token) => this.browserStorage.set('token', this.serialize(token))),
        switchMap(token => this.getUser())
      );
  }

  logout() {
    this.browserStorage.remove(this.config.session_storage_key);
    this.currentUserSubject.next(null);
  }

  public getUser() {
    return this.http.get(environment.baseUrl + '/api/user')
      .pipe(
        tap((user: any) => {
          this.browserStorage.set(this.config.session_storage_key, this.serialize(user));
          this.currentUserSubject.next(user);
        }),
      );
  }

  private serialize(obj: any) {
    return JSON.stringify(obj);
  }

  private deserialize(obj: any) {
    return JSON.parse(obj);
  }

}
