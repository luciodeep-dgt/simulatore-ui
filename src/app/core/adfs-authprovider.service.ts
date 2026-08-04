import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { AuthProvider } from '../auth/auth-provider';

export interface AdfsConfig {
    client_id: string;
    authorize_endpoint: string;
    token_endpoint: string;
    redirect_uri: string;
    resource: string;
}

export let ADFS_CONFIG = new InjectionToken<AdfsConfig>('ADFS Configuration');

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service provider per l'autenticazione
 */
@Injectable()
export class AdfsAuthProvider implements AuthProvider {

    constructor(
        @Inject(ADFS_CONFIG) private readonly config: AdfsConfig,
        private readonly http: HttpClient) {
    }

    signinRedirect() {
        const form = window.document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', this.config.authorize_endpoint);

        form.appendChild(this.createHiddenElement('client_id', this.config.client_id));
        form.appendChild(this.createHiddenElement('redirect_uri', this.config.redirect_uri));
        form.appendChild(this.createHiddenElement('response_type', 'code'));
        form.appendChild(this.createHiddenElement('scope', this.config.scope))

        window.document.body.appendChild(form);
        form.submit();
    }

    signinRedirectCallback() {
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const body = new HttpParams()
          .set('client_id', this.config.client_id)
          .set('redirect_uri', this.config.redirect_uri)
          .set('grant_type', 'authorization_code')
          .set('code', this.getAuthorizationCode());

        return this.http.post(this.config.token_endpoint, body, { headers });
    }

    private getAuthorizationCode() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('code');
    }

    private createHiddenElement(name: string, value: string): HTMLInputElement {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('name', name);
        hiddenField.setAttribute('value', value);
        hiddenField.setAttribute('type', 'hidden');
        return hiddenField;
    }

}
