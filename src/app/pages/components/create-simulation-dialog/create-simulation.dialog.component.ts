import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng';

@Component({
  templateUrl: './create-simulation.dialog.component.html',
  styleUrls: ['./create-simulation.dialog.component.scss']
})
export class CreateSimulationDialogComponent implements OnInit {

  formSubmitted = false;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {

  }

  onCloseDialog() {
    this.ref.close(null);
  }

  onCreate(description: string) {
    this.formSubmitted = true;
    if (description && description.length > 0) {
      this.ref.close(description);
    }
  }
}
