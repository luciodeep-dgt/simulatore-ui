
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from 'primeng';
import { Observable, of } from 'rxjs';
import * as R from 'ramda';

import { Step, StatusStep } from './../../../../shared/models';
import { SimulationStore, StepsMap } from './../../simulation.store';
import { SimulationService } from '../../simulation.service';


@Component({
  selector: 'app-simulation-stepper',
  templateUrl: './simulation-stepper.component.html',
  styleUrls: ['./simulation-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimulationStepperComponent implements OnInit {

  @Input() currentStep: Step;
  @Input() statusSteps?: StepsMap;

  items$: Observable<any[]>;

  constructor(
    private readonly simulationService: SimulationService,
    private readonly store: SimulationStore,
  ) { }

  ngOnInit() {
    this.items$ = of([
      {
        label: 'SIMULATION.STEPPER.SUBCATEGORIES',
        routerLink: 'sottocategorie',
        step: Step.SUBCATEGORIES
      },
      {
        label: 'SIMULATION.STEPPER.DATA_PRICING',
        routerLink: 'data-pricing',
        step: Step.DATA_PRICING
      },
      {
        label: 'SIMULATION.STEPPER.PARAMETRI_DI_BLENDING',
        routerLink: 'parametri-blending',
        step: Step.BLENDING_PARAMS
      },
      {
        label: 'SIMULATION.STEPPER.CEDOLE',
        routerLink: 'cedole',
        step: Step.CEDOLE
      },
      {
        label: 'SIMULATION.STEPPER.PROFILI_GENERATI',
        routerLink: 'profili-generati',
        step: Step.PROFILES
      }
    ]);
  }

  navigateTo(item: MenuItem) {
    this.store.setCurrentStep((item as any).step);
  }

  getStepClass(item: MenuItem) {
    const stepIndex = (item as any).step;
    const step = this.statusSteps[stepIndex];
    const classes: any = {};

    if (step.status === StatusStep.COMPLETED) {
      classes.spuntaVerde = true;
    } else if (step.status === StatusStep.INCOMPLETED) {
      classes.disabled = !step.required;

      if (step.required) {
        const previousStep = R.findLast(key => {
          return key < stepIndex && this.statusSteps[key].required;
        })(Object.keys(this.statusSteps));

        classes.disabled = (!previousStep || this.statusSteps[previousStep].status === StatusStep.INCOMPLETED);
      }
    }

    if (stepIndex === this.currentStep) {
      classes.visible = true;
      classes.borderColored = true;
      classes.disabled = false;
    }

    return classes;
  }

  isCompleted(item) {
    return this.statusSteps[item.step].status === StatusStep.COMPLETED;
  }

  isLinkable(item) {
    return this.isCompleted(item)
      || item.step === this.simulationService.findLatestStep();
  }
}
