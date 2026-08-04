import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { Curve, Constants } from './../../../../../shared/models';


@Component({
  selector: 'app-curve-detail',
  templateUrl: './curve-detail.component.html',
  styleUrls: ['./curve-detail.component.scss']
})
export class CurveDetailComponent implements OnInit, OnChanges {

  @Input() curves: Curve[];
  @Input() disabled = false;
  @Output() editColor = new EventEmitter<Curve>();
  @Output() editCurve = new EventEmitter<Curve>();
  @Output() addCurve = new EventEmitter<Curve>();
  @Output() deleteCurve = new EventEmitter<Curve>();

  groupedCurves: {[key: string]: Curve[]};

  curveColors = {};

  constructor() {

  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.groupedCurves = this.groupBy(this.curves, (curve) => curve.tipologia.id);
  }

  isAddCurveDisabled() {
    return this.curves.length === Constants.MAX_DATA_PRICING;
  }

  onEditColor(curve: Curve) {
    this.editColor.emit(curve);
  }

  onEditCurve(curve: Curve) {
    this.editCurve.emit(curve);
  }

  onAddCurve(curve: Curve) {
    this.addCurve.emit(curve);
  }

  onDeleteCurve(curve: Curve) {
    this.deleteCurve.emit(curve);
  }

  getChartStyle() {
    if (Object.keys(this.groupedCurves).length > 1) {
      return { 'max-width': '50%' };
    }
    return { 'min-width': '100%'};
  }

  private groupBy(xs, f) {
    return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
  }

}
