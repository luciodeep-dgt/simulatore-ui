import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-error-panel',
  templateUrl: './error-panel.component.html',
  styleUrls: ['./error-panel.component.scss']
})
export class ErrorPanelComponent implements OnInit {

  @Input() text;
  @Input() error: HttpErrorResponse;

  constructor() { }

  ngOnInit() {
  }

}
