import { Component, OnInit, Input } from '@angular/core';
import { Simulation } from './../../models';


@Component({
  selector: 'app-info-popup',
  templateUrl: './info-popup.component.html',
  styleUrls: ['./info-popup.component.scss']
})
export class InfoPopupComponent implements OnInit {

  showTooltip: boolean;
  @Input() simulation: Simulation;
  @Input() color?: 'white';

  cedoleDescriptions: string;
  curvesDataPricing: string;
  subcategoriesName: string;
  profilesDescriptions: string;

  constructor() {}

  ngOnInit() {
    this.curvesDataPricing = this.getCurvesDescriptions();
    this.cedoleDescriptions = this.getCedoleDescriptions();
    this.profilesDescriptions = this.getProfilesDescriptions();
    this.subcategoriesName = this.getSubcategoriesName();
  }

  toggleTooltip(toggle: boolean) {
    this.showTooltip = toggle;
  }

  getCurvesDescriptions() {
    return this.simulation.curve
      .map(el => el.descrizione + ((el.flagCustom) ? ' (CUSTOM)' : ''))
      .join(', ');
  }

  getCedoleDescriptions() {
    return this.simulation.cedole
      .map(el => el.descrizione)
      .join(', ');
  }

  getProfilesDescriptions() {
    return this.simulation.scenari
      .map(el => el.descrizione)
      .join(', ');
  }

  getSubcategoriesName() {
    return this.simulation.sottocategorie
      .map(el => el.descrizione)
      .join(', ');
  }

}
