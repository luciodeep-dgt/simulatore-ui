import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng';

@Component({
  templateUrl: './simulation-status.dialog.component.html',
  styleUrls: ['./simulation-status.dialog.component.scss']
})
export class SimulationStatusDialogComponent implements OnInit {

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {

  }

  onCloseDialog(confirm: boolean) {
    this.ref.close(confirm);
  }
}
