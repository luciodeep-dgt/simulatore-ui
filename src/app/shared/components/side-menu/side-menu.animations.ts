import { trigger, transition, style, group, animate, query, state, sequence, animateChild } from '@angular/animations';

export const expandMenuAnimation = trigger('expandMenu', [
    state('true', style({ width: '14em' })),
    state('false', style({ width: '80px' })),
    transition('true => false', [
        animate('10ms')
    ]),
    transition('false => true', [
        sequence([
            query('@fadeInOut', animateChild({ duration: '400ms' })),
            group([
                query('@frecciaVerde', animateChild({ duration: '100ms' })),
                animate('100ms'),
            ]),
        ])
    ]),
]);

export const menuItemAnimation = trigger('menuItemAnimation', [
    state('true', style({ display: 'inline-block' })),
    state('false', style({ display: 'none' })),
    transition('false <=> true', animate('400ms'))
]);

export const fadeInOut = trigger('fadeInOut', [
    state('in', style({ opacity: 1 })),
    transition(':enter', [
        style({ opacity: 0 }),
        animate(600),
    ]),
    transition(':leave', [
        animate(600, style({ opacity: 0 }))
    ])
]);

export const frecciaVerde = trigger('frecciaVerde', [
    state('in', style({ opacity: 1 })),
    transition(':enter', [
        style({ opacity: 0 }),
        animate(600),
    ]),
    transition(':leave', [
        animate(600, style({ opacity: 0 }))
    ])
]);
