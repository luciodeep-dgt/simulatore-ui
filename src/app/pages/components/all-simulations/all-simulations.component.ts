import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent, ConfirmationService } from 'primeng';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RSQLCriteria, RSQLFilterExpression, Operators } from 'rsql-criteria-typescript';

import { IgnoreCaseOperator } from './../../../../core/ignore-case.operator';
import { DataService } from './../../../../core/data.service';
import { SIMULATION_STATUS_SERVICE } from './../../../../core/data-services';
import { SimulationDataService } from './../../../../core/simulation-data.service';
import { SimulationStatus, Simulation, SearchFilters, Pageable, SimulationStatusEnum } from './../../../../shared/models';


@Component({
  selector: 'app-all-simulations',
  templateUrl: './all-simulations.component.html',
  styleUrls: ['./all-simulations.component.scss']
})
export class AllSimulationsComponent implements OnInit {

  @ViewChild('searchInput', { static: true }) searchInput: NgModel;

  simulations$: Observable<Pageable<Simulation>>;
  simulationsStatusOptions$: Observable<any[]>;

  onLazyLoad$: Subject<any>;

  rowsForPage = 10;
  searchText: string;
  searchStatus: SimulationStatusEnum;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly loaderService: NgxUiLoaderService,
    private readonly simulationService: SimulationDataService,
    @Inject(SIMULATION_STATUS_SERVICE) private readonly simulationStatusService: DataService<SimulationStatus>,
    private router: Router,
    private translateService: TranslateService
  ) {
    const initialEvent = { first: 0, rows: this.rowsForPage, sortField: null, sortOrder: null };
    this.onLazyLoad$ = new Subject<any>();

    this.simulations$ = this.getSimulations();
    this.simulationsStatusOptions$ = this.getSimulationStatusOptions();
  }

  ngOnInit() {
    this.searchInput.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe(value => this.onTextChange());
  }

  getSimulations() {
    return this.onLazyLoad$.asObservable()
      .pipe(
        tap(_ => this.loaderService.startLoader('all-simulations')),
        switchMap(event =>
          this.searchSimulation(event)
            .pipe(tap({ complete: () => this.loaderService.stopLoader('all-simulations') })))
      );
  }

  getSimulationStatusOptions() {
    const rsql = new RSQLCriteria('filter', 'sort', 'limit', 'totalCount', 'offset');
    rsql.orderBy.add('descrizione', 'asc');
    const query = rsql.build();
    return this.simulationStatusService.getAll(query)
      .pipe(map(data => {
        let options = [{ label: 'Tutti', value: null }];
        options = options.concat(
          data.items.map(i => ({ label: i.descrizione, value: i.codice }))
        );
        return options;
      }));
  }

  onAction(event) {
    const idSimulazione = event.row;
    switch (event.type) {
      case 'view':
        this.router.navigate(['simulazione', idSimulazione], { skipLocationChange: true});
        break;
      case 'delete':
        this.confirmationService.confirm({
          header: 'Attenzione!',
          message: this.translateService.instant('HOME.ALL_SIMULATIONS.DIALOG_DELETE'),
          icon: null,
          accept: () => this.deleteSimulation(idSimulazione)
        });
        break;
    }
  }

  onTextChange() {
    // Search for searchText, resetting the current current page and current sortable
    const filters: SearchFilters = new SearchFilters(this.searchText, this.searchStatus);
    const event = { first: 0, rows: this.rowsForPage, sortField: null, sortOrder: null, filters };
    this.onLazyLoad$.next(event);
  }

  onStatusChange() {
    const filters: SearchFilters = new SearchFilters(this.searchText, this.searchStatus);
    const event = { first: 0, rows: this.rowsForPage, sortField: null, sortOrder: null, filters };
    this.onLazyLoad$.next(event);
  }

  onPageChange(event: LazyLoadEvent | any) {
    event.filters = new SearchFilters(this.searchText, this.searchStatus);
    this.onLazyLoad$.next(event);
  }

  searchSimulation(event: LazyLoadEvent | any) {
    let sort: 'asc' | 'desc';

    const rsql = new RSQLCriteria('query', 'sort', 'limit', 'totalCount', 'offset');
    rsql.includeTotalCount = false;
    if (event.filters) {
      const filters = event.filters;
      if (filters.fulltext) {
        rsql.filters.and(new RSQLFilterExpression('descrizione', new IgnoreCaseOperator(), filters.fulltext));
      }
      if (filters.stato) {
        rsql.filters.and(new RSQLFilterExpression('stato.codice', Operators.Equal, filters.stato));
      }
    }
    if (event.sortField) {
      sort = (event.sortOrder === 1) ? 'asc' : 'desc';
      rsql.orderBy.add(event.sortField, sort);
    }
    rsql.pageNumber = Math.floor(event.first / event.rows);
    rsql.pageSize = event.rows;

    const embed = 'cedole,curve,sottocategorie,scenari';
    const query = rsql.build() + '&embed=' + embed;
    return this.simulationService.getAll(query)
      .pipe(
        catchError(error => of({
          items: [],
          count: 0,
          totalCount: 0,
          offset: 0,
          limit: 10
        }))
      );
  }

  deleteSimulation(idSimulazione: number) {
    this.loaderService.startLoader('all-simulations');
    this.simulationService.delete(idSimulazione)
    .subscribe(
      success => { this.loaderService.stopLoader('all-simulations'); this.onStatusChange(); },
      error => this.loaderService.stopLoader('all-simulations')
    );
  }

}
