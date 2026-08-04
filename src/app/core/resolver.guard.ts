import { SimulationStore } from './../pages/simulation/simulation.store';
import { SimulationComponent } from './../pages/simulation/simulation.component';
import { SimulationResolver } from './../pages/simulation/simulation.resolver';
import { map, tap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Vede nella mappa creata dal simulation component se lo step associato alla path a cui si
 * è diretto ha come stato o "COMPLETED" o "CURRENT" in modo tale che ci posso atterrare, se
 * non ci può atterrare allora lo deve reindirizzare al main component di simulation component
 */

@Injectable({ providedIn: 'root' })
export class ResolverGuard implements CanActivate, CanDeactivate<SimulationComponent> {
  constructor(
    private readonly simulationResolver: SimulationResolver,
    private readonly store: SimulationStore
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.simulationResolver.resolve(route).pipe(
      map(result => true)
    );
  }

  canDeactivate(
    component: SimulationComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.store.reset();
    return true;
  }
}
