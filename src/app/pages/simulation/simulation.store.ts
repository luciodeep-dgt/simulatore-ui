import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as R from 'ramda';
import { map } from 'rxjs/operators';

import { Scenario } from './../../shared/models/scenario.model';
import { Subcategory, Simulation, Curve, Step, BlendingParam, StatusStep, Cedola, CedolaDetail } from './../../shared/models';
import { Store } from '../../core/store.service';
import TintGeneratorHelper from '../../shared/helpers/tint-generator.helper';

export interface StepsMap {
  [id: number]: {
    status: StatusStep,
    required: boolean,
    isFirst: boolean,
    isLast: boolean
  };
}

export interface SimulationState {
  step?: Step;
  statusSteps?: StepsMap;
  simulation?: Simulation;
  blendingParams?: BlendingParam;
  curves?: Curve[];
  cedole?: Cedola[];
  cedoleToView?: Cedola[];
  profiles?: Scenario[];
  subcategories?: Subcategory[];
}

const initialState: SimulationState = {
  step: Step.SUBCATEGORIES,
  simulation: null,
  statusSteps: {
    [Step.SUBCATEGORIES]: { status: StatusStep.INCOMPLETED, required: true, isFirst: true, isLast: false },
    [Step.DATA_PRICING]: { status: StatusStep.INCOMPLETED, required: true, isFirst: false, isLast: false },
    [Step.BLENDING_PARAMS]: { status: StatusStep.INCOMPLETED, required: true, isFirst: false, isLast: false },
    [Step.CEDOLE]: { status: StatusStep.INCOMPLETED, required: true, isFirst: false, isLast: false },
    [Step.PROFILES]: { status: StatusStep.INCOMPLETED, required: true, isFirst: false, isLast: true }
  },
  blendingParams: null,
  cedole: null,
  cedoleToView: null,
  profiles: [],
  curves: [],
  subcategories: []
};

@Injectable()
export class SimulationStore extends Store<SimulationState> {

  blendingParams$ = this.state$.pipe(map(state => state.blendingParams));
  currentStep$ = this.state$.pipe(map(state => state.step));
  simulation$ = this.state$.pipe(map(state => state.simulation));
  subcategories$ = this.state$.pipe(map(state => state.subcategories));
  curves$ = this.state$.pipe(map(state => state.curves));
  cedoleToView$ = this.state$.pipe(map(state => state.cedoleToView));
  cedole$ = this.state$.pipe(map(state => state.cedole));
  profiles$ = this.state$.pipe(map(state => state.profiles));
  statusSteps$ = this.state$.pipe(map(state => state.statusSteps));

  isBlendingEnabled$ = this.state$.pipe(
    map(state => state.subcategories.some(s => s.flagParametriBlending))
  );
  isCedoleEnabled$ = this.state$.pipe(
    map(state => state.subcategories.some(s => s.flagCedole))
  );
  isBackDisabled$ = this.state$.pipe(
    map(state => state.statusSteps[state.step].isFirst)
  );
  isNextDisabled$ = this.state$.pipe(
    map(state => state.statusSteps[state.step].isLast
      || state.statusSteps[state.step].status === StatusStep.INCOMPLETED)
  );

  constructor() {
    super(initialState);
  }

  // SIMULAZIONI
  setSimulation(simulation: Simulation) {
    const state = {
      ...super.getStateSnapshot(),
      simulation
    };
    super.setState(state);
  }

  // SOTTOCATEGORIE
  setSubcategories(subcategories: Subcategory[]) {
    const state = {
      ...super.getStateSnapshot(),
      subcategories
    };
    super.setState(state);
  }

  addDataEmissione(dataEmissione: Date) {
    const currentState = super.getStateSnapshot();
    const state = {
      ...currentState,
      simulation: {...currentState.simulation, dataEmissione}
    };
    super.setState(state);
  }

  addSubcategory(subcategory: Subcategory) {
    const state = super.getStateSnapshot();
    state.subcategories = [...state.subcategories, subcategory];
    const newState = {
      ...super.getStateSnapshot(),
      state
    };
    super.setState(newState);
  }

  removeSubcategory(subcategory: Subcategory) {
    const state = super.getStateSnapshot();
    state.subcategories = state.subcategories.filter(subcat => subcat.id !== subcategory.id);
    const newState = {
      ...super.getStateSnapshot(),
      state
    };
    super.setState(newState);
  }

  // CURVE
  addCurve(curves: Curve[]) {
    let newCurves = super.getStateSnapshot().curves || [];
    newCurves = newCurves.concat(curves);


    const curveByTipologia = newCurves.reduce((acc, c) => {
      acc[c.tipologia.id] = acc[c.tipologia.id] || [];
      acc[c.tipologia.id].push(c);
      return acc;
    }, {});

    Object.keys(curveByTipologia).forEach(k => {
      const coloreTipologia = curveByTipologia[k][0].tipologia.colore;
      const colors = TintGeneratorHelper.calculate(coloreTipologia, curveByTipologia[k].length);
      curveByTipologia[k].forEach((curva, index) => {
        curva.colore = curva.colore || colors[index];
      });
    });

    const newState = {
      ...super.getStateSnapshot(),
      curves: newCurves
    };
    super.setState(newState);
  }

  editCurve(newCurve: Curve) {
    const curves = super.getStateSnapshot().curves;
    const indexToEdit = curves.findIndex(curve => curve.id === newCurve.id);
    curves[indexToEdit] = newCurve;
    const newState = {
      ...super.getStateSnapshot(),
      curves: [...curves]
    };
    super.setState(newState);
  }

  removeCurveFromDate(date: Date) {
    let curves = super.getStateSnapshot().curves;
    // TODO: Da verificare se elimina correttamente solo quelle non custom
    curves = curves.filter(curve => String(curve.dataPricing) !== moment(date).format().split('T')[0] || curve.flagCustom);
    const newState = {
      ...super.getStateSnapshot(),
      curves
    };
    super.setState(newState);
  }

  deleteCurve(curve: Curve) {
    const state = super.getStateSnapshot();
    state.curves = state.curves.filter(stateCurve => stateCurve.id !== curve.id);
    const newState = {
      ...super.getStateSnapshot(),
      state
    };
    super.setState(newState);
  }

  // PARAMETRO BLENDING
  setBlendingParams(blendingParams: BlendingParam) {
    const state = {
      ...super.getStateSnapshot(),
      blendingParams
    };
    super.setState(state);
  }

  // CEDOLE
  setCedole(cedole: Cedola[]) {
    const state = {
      ...super.getStateSnapshot(),
      cedole,
      cedoleToView: cedole
    };
    super.setState(state);
  }

  // SCENARI
  setProfiles(profiles: Scenario[]) {
    const state = {
      ...super.getStateSnapshot(),
      profiles,
    };
    super.setState(state);
  }

  addCedola(cedola: Cedola) {
    let stateCedole = super.getStateSnapshot().cedole;
    stateCedole = [...stateCedole, cedola];
    const newState = {
      ...super.getStateSnapshot(),
      cedole: stateCedole,
      cedoleToView: stateCedole
    };
    super.setState(newState);
  }

  deleteCedola(cedola: Cedola) {
    const state = super.getStateSnapshot();
    const cedole = state.cedole.filter(stateCedole => stateCedole.id !== cedola.id);
    const newState = {
      ...super.getStateSnapshot(),
      cedole,
      cedoleToView: cedole
    };
    super.setState(newState);
  }

  editCedola(idCedola: string, cedola: Cedola) {
    let cedole = [...this.getStateSnapshot().cedole];
    const cedolaToEditIndex = cedole.findIndex(el => el.id === cedola.id);
    cedole[cedolaToEditIndex] = cedola;
    const manyCedoleAdmitted = this.getStateSnapshot().subcategories.length === 1;
    if (!manyCedoleAdmitted) {
      cedole = [cedola];
    }
    const state = {
      ...super.getStateSnapshot(),
      cedole,
      cedoleToView: cedole
    };
    super.setState(state);
  }

  editCedolaDetail(dettaglioCedola: CedolaDetail) {
    const cedole = this.getStateSnapshot().cedole;
    const cedola = this.getCedolaById(dettaglioCedola.idCedola);
    const sottocategorieEdited = cedola.prodotti.map(subcat => {
      return {
        ...subcat,
        tassi: subcat.tassi.map(detail => {
          if (detail.id === dettaglioCedola.id && detail.dataRiferimento === dettaglioCedola.dataRiferimento) {
            detail = dettaglioCedola;
          }
          return detail;
        })
      };
    });
    cedola.prodotti = sottocategorieEdited;
    const newState = {
      ...super.getStateSnapshot(),
      ...cedole.map(el => {
        if (el.id === dettaglioCedola.idCedola) {
          el = cedola;
        }
        return el;
      })
    };
    super.setState(newState);
  }

  private getCedolaById(id: string) {
    const cedole = this.getStateSnapshot().cedole;
    return (cedole) ? cedole.find(cedola => cedola.id === id) : null;
  }

  // SCENARI
  validateProfile(idProfilo: any) {
    const profiles = this.getStateSnapshot().profiles;
    let profilo = profiles.find(p => p.id === idProfilo);
    profilo = {
      ...profilo,
      flagValidato: !profilo.flagValidato
    };
    const newState = {
      ...super.getStateSnapshot(),
      profiles
    };
    super.setState(newState);
  }

  // STEPS
  setCurrentStep(step: Step) {
    const state = {
      ...super.getStateSnapshot(),
      step
    };
    super.setState(state);
  }

  setStatusSteps(statusSteps: StepsMap) {
    const state = {
      ...super.getStateSnapshot(),
      statusSteps
    };
    super.setState(state);
  }

}
