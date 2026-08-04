import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Simulation } from '../../../../shared/models';
import UtilsHelper from '../../../../shared/helpers/utils.helper';

@Component({
  selector: 'app-simulation-banner',
  templateUrl: './simulation-banner.component.html',
  styleUrls: ['./simulation-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimulationBannerComponent implements OnInit {

  @Input() simulation: Simulation;

  constructor() { }

  ngOnInit() {
  }

  getStatusStyleChips(simulation: Simulation, isText = false) {
    return UtilsHelper.getStatusStyleChips(simulation, isText);
  }

}
