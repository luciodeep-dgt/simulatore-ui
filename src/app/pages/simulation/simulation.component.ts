import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import * as R from 'ramda';

import { SimulationService } from './simulation.service';
import { SimulationStore, StepsMap } from './simulation.store';
import { Simulation, STEP_PATH, Step, StatusStep, SimulationStatusEnum } from '../../shared/models';


@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  currentStep$: Observable<Step>;
  statusSteps$: Observable<StepsMap>;
  simulation$: Observable<Simulation>;
  isBackDisabled$: Observable<boolean>;
  isNextDisabled$: Observable<boolean>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly store: SimulationStore,
    private readonly simulationService: SimulationService
  ) {
    this.currentStep$ = this.store.currentStep$;
    this.statusSteps$ = this.store.statusSteps$;
    this.simulation$ = this.store.simulation$;
    this.isBackDisabled$ = this.store.isBackDisabled$;
    this.isNextDisabled$ = this.store.isNextDisabled$;
  }

  ngOnInit() {
    if (!this.activatedRoute.firstChild) {
      this.redirectToLatestStep();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  saveAndExit() {
    const state = this.store.getStateSnapshot();
    const currentStep = state.step;
    const latestStep = this.simulationService.findLatestStep();
    if (currentStep !== latestStep) {
      this.router.navigate([STEP_PATH[latestStep]], { relativeTo: this.activatedRoute })
      .then(_ => setTimeout(x => this.simulationService.saveAndClose(), 300));
    } else {
      this.simulationService.saveAndClose();
    }
  }

  onBack() {
    this.simulationService.back();
    const previousStep = this.getPreviousStep();
    this.router.navigate([STEP_PATH[previousStep]], { relativeTo: this.activatedRoute });
  }

  onNext() {
    this.simulationService.next();
    const nextStep = this.getNextStep();
    this.router.navigate([STEP_PATH[nextStep]], { relativeTo: this.activatedRoute });
  }

  saveAndProceed() {
    this.simulationService.saveAndNext();
  }

  isSaveDisabled() {
    const state = this.store.getStateSnapshot();
    const statusSimulation = state.simulation.stato;
    const statusSteps = state.statusSteps;
    return statusSimulation.codice !== SimulationStatusEnum.WORK_IN_PROGRESS ||
      statusSteps[state.step].status === StatusStep.COMPLETED;
  }

  isLastStep() {
    const state = this.store.getStateSnapshot();
    const currentStep = state.step;
    const statusSteps = state.statusSteps;
    return statusSteps[currentStep].isLast;
  }

  private getPreviousStep() {
    const state = this.store.getStateSnapshot();
    const currentStep = state.step;
    const statusSteps = state.statusSteps;

    let previousStep = state.step;
    if (!statusSteps[currentStep].isFirst) {
      previousStep = R.findLast(key => {
        return key < state.step && statusSteps[key].required;
      })(Object.keys(statusSteps));
    }
    return previousStep;
  }

  private getNextStep() {
    const state = this.store.getStateSnapshot();
    const currentStep = state.step;
    const statusSteps = state.statusSteps;

    let nextStep = state.step;
    if (!statusSteps[currentStep].isLast) {
      nextStep = R.find(key => {
        return key > state.step && statusSteps[key].required;
      })(Object.keys(statusSteps));
    }

    return nextStep;
  }

  private redirectToLatestStep() {
    const latestStep = this.simulationService.findLatestStep();
    this.router.navigate([STEP_PATH[latestStep]], { relativeTo: this.activatedRoute });
  }

}
