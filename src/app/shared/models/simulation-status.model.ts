export class SimulationStatus {
  id: number;
  codice: SimulationStatusEnum;
  descrizione: string;
}

export enum SimulationStatusEnum {
  WORK_IN_PROGRESS = 'LAV',
  DONE = 'CON',
  VALIDATED = 'VAL',
  REMOVED = 'ARC'
}
