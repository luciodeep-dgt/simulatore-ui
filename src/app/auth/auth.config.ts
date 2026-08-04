import { InjectionToken } from '@angular/core';

export interface AuthConfiguration {
    session_storage_key: string;
}

export let AUTH_CONFIG = new InjectionToken<AuthConfiguration>('Authentication Configuration');
