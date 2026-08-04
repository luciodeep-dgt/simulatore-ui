import { SimulationStore } from './simulation.store';
import { Injectable, EventEmitter } from '@angular/core';
import * as R from 'ramda';

import { Step, StatusStep, SimulationStatusEnum } from './../../shared/models';

@Injectable()
export class SimulationService {

  public onBack$: EventEmitter<void>;
  public onNext$: EventEmitter<void>;
  public onSaveAndNext$: EventEmitter<void>;
  public onSaveAndClose$: EventEmitter<void>;

  constructor(private readonly store: SimulationStore) {
    this.onBack$ = new EventEmitter();
    this.onNext$ = new EventEmitter();
    this.onSaveAndNext$ = new EventEmitter();
    this.onSaveAndClose$ = new EventEmitter();
  }

  public next() {
    this.onNext$.next();
  }

  public back() {
    this.onBack$.next();
  }

  public saveAndNext() {
    this.onSaveAndNext$.next();
  }

  public saveAndClose() {
    this.onSaveAndClose$.next();
  }

  public findLatestStep() {
    const state = this.store.getStateSnapshot();
    const statusSteps = state.statusSteps;
    let latestStep = R.find((key => {
      const step = statusSteps[Number(key)];
      return step.required && step.status === StatusStep.INCOMPLETED;
    }))(Object.keys(statusSteps));

    if (latestStep === undefined || latestStep === null) {
      latestStep = R.findLast((key => {
        const step = statusSteps[Number(key)];
        return step.status === StatusStep.COMPLETED;
      }))(Object.keys(statusSteps));
    }
    return Number(latestStep);
  }

  public handleSimulationSteps() {
    const state = this.store.getStateSnapshot();
    const simulation = state.simulation;
    const newStatusSteps = {};

    [Step.SUBCATEGORIES, Step.DATA_PRICING, Step.BLENDING_PARAMS, Step.CEDOLE, Step.PROFILES]
    .forEach((ss, index) => {
      const step = { ...state.statusSteps[index] };
      switch (index) {
        case Step.SUBCATEGORIES: {
          step.status = (state.subcategories && state.subcategories.length > 0) ?
            StatusStep.COMPLETED : StatusStep.INCOMPLETED;
          break;
        }
        case Step.DATA_PRICING: {
          step.required = (state.subcategories && state.subcategories.some(s => s.flagDataPricing === true)) || (!R.isNil(simulation.curve) && !R.isEmpty(simulation.curve)); // la prima expr può restituire false se il modello viene aggiornato successivamente alla simulazione
          step.status = step.required && (state.curves && state.curves.length > 0) ?
            StatusStep.COMPLETED : StatusStep.INCOMPLETED;
          break;
        }
        case Step.BLENDING_PARAMS: {
          step.required = (state.subcategories && state.subcategories.some(s => s.flagParametriBlending === true)) || !!simulation.parametroBlending; // vedi commento sopra
          step.status = step.required && (state.blendingParams !== null) ?
            StatusStep.COMPLETED : StatusStep.INCOMPLETED;
          break;
        }
        case Step.CEDOLE: {
          step.required = (state.subcategories && state.subcategories.some(s => s.flagCedole === true)) || (!R.isNil(simulation.cedole) && !R.isEmpty(simulation.cedole)); // vedi commento sopra
          step.status = step.required && (state.cedole && state.cedole.length > 0) ?
            StatusStep.COMPLETED : StatusStep.INCOMPLETED;
          break;
        }
        case Step.PROFILES: {
          const simulationState = simulation.stato;
          step.status = (simulationState.codice === SimulationStatusEnum.DONE
            || simulationState.codice === SimulationStatusEnum.VALIDATED)
           ? StatusStep.COMPLETED : StatusStep.INCOMPLETED;
          break;
        }
      }
      newStatusSteps[index] = step;
    })

    this.store.setStatusSteps(newStatusSteps);
  }

}
