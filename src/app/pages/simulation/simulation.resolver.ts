import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as R from 'ramda';

import { SimulationService } from './simulation.service';
import { SimulationStore } from './simulation.store';
import { Simulation } from '../../shared/models';
import { BlendingParam } from './../../shared/models/blending-param.model';
import { NotificationService } from './../../core/notification.service';
import { SimulationDataService } from './../../core/simulation-data.service';


@Injectable()
export class SimulationResolver implements Resolve<Simulation> {
  constructor(
    private readonly simulationDataService: SimulationDataService,
    private readonly simulationService: SimulationService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly store: SimulationStore
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const simulationId = route.paramMap.get('id');
    const requests = [
      this.simulationDataService.getById(simulationId),
      this.simulationDataService.getSubcategories(simulationId),
      this.simulationDataService.getCurves(simulationId),
      this.simulationDataService.getCedole(simulationId),
      this.simulationDataService.getScenari(simulationId),
    ];
    return forkJoin(requests).pipe(
      map((result: any) => {
        const simulation = result[0];
        const subcategories = result[1].items;
        const curves = result[2].items;
        const cedole = R.isEmpty(result[3].items) ? null : result[3].items;
        const scenari = result[4].items;
        return {  simulation, subcategories, curves, cedole, scenari };
      }),
      tap(result => {
        this.store.setSimulation(result.simulation);
        if (result.simulation.parametroBlending) {
          const blending = new BlendingParam();
          blending.id = result.simulation.parametroBlending;
          this.store.setBlendingParams(blending);
        }
        this.store.setSubcategories(result.subcategories as any || []);
        this.store.addCurve(result.curves as any || []);
        this.store.setCedole(result.cedole as any);
        this.store.setProfiles(result.scenari as any || []);
        this.simulationService.handleSimulationSteps();
      }),
      catchError(error => {
        this.router.navigate(['']);
        return throwError(error);
      })
    );
  }
}
