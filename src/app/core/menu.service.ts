import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MenuItem {
    title: string;
    link?: string;
    url?: string;
    icon?: string;
    data?: any;
    permissions: string[];
    children?: MenuItem[];
}

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service per la generazione di menu dalle rotte
 */
@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private openSubject: BehaviorSubject<boolean>;
    open$: Observable<boolean>;

    constructor() {
        this.openSubject = new BehaviorSubject(false);
        this.open$ = this.openSubject.asObservable();
    }

    notify(status: boolean) {
        this.openSubject.next(status);
    }

    getItems(): Observable<MenuItem[]> {
        return of([
            {
                title: 'MENU.HOME',
                link: 'home',
                icon: 'bi-house',
                permissions: ['OPERATORE', 'VALIDATORE', 'ADMIN', 'SUPERADMIN']
            },
            {
                title: 'MENU.SISPAR',
                link: 'sispar',
                url: environment.sispar,
                icon: 'bi-grid',
                permissions: ['OPERATORE', 'VALIDATORE', 'ADMIN', 'SUPERADMIN']
            },
            {
                title: 'MENU.SETTINGS',
                link: 'settings',
                icon: 'bi-gear',
                permissions: []
            },
        ]);
    }

}
