import { Simulation, SimulationStatusEnum } from './../models';

export default class UtilsHelper {

  public static getStatusStyleChips(simulation: Simulation, isText = false) {
    switch (simulation.stato.codice) {
      case SimulationStatusEnum.WORK_IN_PROGRESS: return (!isText) ? 'chip-primary' : 'none';
      case SimulationStatusEnum.DONE: return (!isText) ? 'bg-success' : 'text-white';
      case SimulationStatusEnum.VALIDATED: return (!isText) ? 'bg-warning' : 'text-white';
      case SimulationStatusEnum.REMOVED: return (!isText) ? 'bg-danger' : 'text-white';
    }
  }
}

