import UtilsHelper from './../../../../../shared/helpers/utils.helper';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Simulation } from './../../../../../shared/models';

@Component({
  selector: 'app-simulation-card',
  templateUrl: './simulation-card.component.html',
  styleUrls: ['./simulation-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimulationCardComponent implements OnInit {

  @Input() simulation: Simulation;

  constructor() { }

  ngOnInit() { }

  getStatusStyleChips(simulation: Simulation, isText = false) {
    return UtilsHelper.getStatusStyleChips(simulation, isText);
  }

}
