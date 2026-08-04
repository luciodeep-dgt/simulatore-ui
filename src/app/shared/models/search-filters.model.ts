import { SimulationStatusEnum } from './simulation-status.model';

export class SearchFilters {
  fulltext?: string;
  stato?: SimulationStatusEnum;

  constructor(fulltext?: string, status?: SimulationStatusEnum) {
    this.fulltext = fulltext;
    this.stato = status;
  }
}
