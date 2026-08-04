import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-add-simulation-card',
  templateUrl: './add-simulation-card.component.html',
  styleUrls: ['./add-simulation-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSimulationCardComponent implements OnInit {

  @Input() title: string;
  @Input() buttonText: string;
  @Input() headerImage?: string;
  @Output() clickButton = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

  onClickNext() {
    this.clickButton.next();
  }

}
