import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { LazyLoadEvent, Table, SortEvent } from 'primeng';
import { Simulation, Pageable } from '../../../../../shared/models';
import UtilsHelper from '../../../../../shared/helpers/utils.helper';

export interface ListActionEvent {
  type: string;
  row: number;
}


@Component({
  selector: 'app-simulations-list',
  templateUrl: './simulations-list.component.html',
  styleUrls: ['./simulations-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimulationsListComponent implements OnInit {

  @ViewChild('table', { static: true }) table: Table;

  @Input() simulations: Pageable<Simulation>;
  @Input() rowsForPage = 10;
  @Output() pageChange = new EventEmitter<LazyLoadEvent>();
  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() action = new EventEmitter<ListActionEvent>();

  constructor() { }

  ngOnInit() { }

  paginate($event) {
    this.pageChange.emit($event);
  }

  sort($event: SortEvent) {
    this.sortChange.emit($event);
  }

  getStatusStyleChips(simulation: Simulation, isText = false) {
    return UtilsHelper.getStatusStyleChips(simulation, isText);
  }

}
