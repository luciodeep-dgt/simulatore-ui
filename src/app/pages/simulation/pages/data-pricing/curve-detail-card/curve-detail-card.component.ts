import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Curve } from './../../../../../shared/models';


@Component({
  selector: 'app-curve-detail-card',
  templateUrl: './curve-detail-card.component.html',
  styleUrls: ['./curve-detail-card.component.scss']
})
export class CurveDetailCardComponent implements OnInit {

  @Input() curve: Curve;
  @Input() disabled = false;
  @Output() editColor = new EventEmitter<Curve>();
  @Output() editCurve = new EventEmitter<Curve>();
  @Output() addCurve = new EventEmitter<Curve>();
  @Output() deleteCurve = new EventEmitter<Curve>();

  colorControl: FormControl;

  constructor() {}

  ngOnInit() {
    this.colorControl = new FormControl({ value: this.curve.colore, disabled: this.disabled });
    this.colorControl.valueChanges
    .pipe(debounceTime(300))
    .subscribe(colore => {
      this.curve.colore = colore;
      this.editColor.emit(this.curve);
   });
  }

  onEditCurve() {
    if (!this.disabled) {
      this.editCurve.emit(this.curve);
    }
  }

  onDelete() {
    if (!this.disabled) {
      this.deleteCurve.emit(this.curve);
    }
  }

  onAddCurve() {
    if (!this.disabled) {
      this.addCurve.emit(this.curve);
    }
  }

}
