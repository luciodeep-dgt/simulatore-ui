import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, } from '@angular/core';
import { ReplaySubject, interval } from 'rxjs';
import { takeUntil, throttle, debounceTime } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { NotificationService } from '../../../core/notification.service';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Componente globale per la gestione dei messaggi
 */
@Component({
    selector: 'app-messages',
    templateUrl: 'messages.component.html',
    styleUrls: ['./messages.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [ MessageService ],
})
export class MessagesComponent implements OnInit, OnDestroy {

    private destroyed$: ReplaySubject<boolean>;

    constructor(private readonly messageService: MessageService,
                private readonly notificationService: NotificationService) {
        this.destroyed$ = new ReplaySubject(1);
    }

    ngOnInit() {
        this.notificationService.notificationChange$
        .pipe(takeUntil(this.destroyed$)) // throttle(x => interval(500))
        .subscribe(notification =>
            this.messageService.add({
                ...notification,
                detail: notification.message,
                summary: notification.title
            })
        );
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
