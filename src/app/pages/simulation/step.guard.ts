import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { StatusStep, Step } from './../../shared/models';
import { SimulationStore } from './../../pages/simulation/simulation.store';
import { STEP_PATH } from '../../shared/models';
import { SimulationService } from './simulation.service';

@Injectable()
export class StepGuard implements CanActivate {
  constructor(
    private readonly store: SimulationStore,
    private readonly simulationService: SimulationService,
    private readonly router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.statusSteps$.pipe(
      map(status => {
        const targetStep = Number(Object.keys(STEP_PATH).find(key => STEP_PATH[key] === route.routeConfig.path)) as Step;
        const step = status[targetStep];
        return step.status === StatusStep.COMPLETED || (step.required && step.status === StatusStep.INCOMPLETED);
      }),
      tap(canActivate => {
        if (!canActivate) {
          this.redirectToLatestStep(route);
        }
      })
    );
  }

  private redirectToLatestStep(route: ActivatedRouteSnapshot) {
    const latestStep = this.simulationService.findLatestStep();
    // this.store.setCurrentStep(latestStep);
    this.router.navigate(['simulazione', route.parent.params.id, STEP_PATH[latestStep]]);
  }
}
