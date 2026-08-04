import { BlendingParam } from './blending-param.model';
import { Curve } from './curve.model';
import { SimulationStatus } from './simulation-status.model';
import { Subcategory } from './subcategory.model';

export enum ValidationStatus {
  VALIDATED,
  NOT_VALIDATED
}

export class Simulation {
  id: number;
  utenteCreazione: string;
  dataCreazione: Date;
  stato: SimulationStatus;
  descrizione: string;
  dataEmissione?: Date;
  validationStatus: ValidationStatus;
  dataPricing?: any;
  cedole?: any;
  scenari?: any;
  sottocategorie?: Subcategory[];
  curve?: Curve[];
  parametroBlending?: BlendingParam;
}
