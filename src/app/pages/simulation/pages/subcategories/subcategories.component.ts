import { Component, OnInit,  OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LazyLoadEvent, DialogService } from 'primeng';
import { RSQLCriteria, RSQLFilterExpression } from 'rsql-criteria-typescript';
import { Observable, Subscription, Subject, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, switchMap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { StatusStep } from './../../../../shared/models/step.enum';
import { IgnoreCaseOperator } from './../../../../core/ignore-case.operator';
import { NotificationService } from './../../../../core/notification.service';
import { SimulationDataService } from './../../../../core/simulation-data.service';
import { SimulationStatusDialogComponent } from './../../components/simulation-status-dialog/simulation-status.dialog.component';
import { SimulationService } from './../../simulation.service';
import { SimulationStore } from './../../simulation.store';
import { Subcategory, Pageable, Step, STEP_PATH, SimulationStatusEnum } from './../../../../shared/models';
import { SubcategoryDataService } from '../../../../core/subcategory-data.service';


@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubcategoriesComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput', { static: true }) searchInput: NgModel;

  destroy$: Subject<boolean> = new Subject<boolean>();
  subcategories$: Observable<Pageable<Subcategory>>;
  selectedCategories$: Observable<Subcategory[]>;
  onLazyLoad$: Subject<LazyLoadEvent>;

  error: HttpErrorResponse;
  rowsForPage = 10;
  searchText: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly subcategoriesService: SubcategoryDataService,
    private readonly simulationData: SimulationDataService,
    private readonly dialogService: DialogService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly store: SimulationStore,
    private readonly loaderService: NgxUiLoaderService,
    private readonly simulationService: SimulationService
  ) {
    this.selectedCategories$ = this.store.subcategories$;
    this.store.setCurrentStep(Step.SUBCATEGORIES);

    const initialEvent = { first: 0, rows: this.rowsForPage, sortField: null, sortOrder: null };
    this.onLazyLoad$ = new Subject<LazyLoadEvent>();

    this.subcategories$ = (!this.isDisabled()) ? this.getSubcategories() : this.selectedCategories$
      .pipe(map(el => ({
        items: el,
        count: 0,
        totalCount: el.length,
        offset: 0,
        limit: 10
      })));
  }

  ngOnInit() {
    this.handleEvents();
    this.searchInput.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe(value => this.onTextChange());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getSubcategories() {
    return this.onLazyLoad$.asObservable()
      .pipe(
        tap(_ => this.loaderService.startLoader('subcategories-list')),
        switchMap(event =>
          this.searchSubcategories(event)
            .pipe(tap({ complete: () => this.loaderService.stopLoader('subcategories-list') })))
      );
  }

  onSelectSubcategory($event: { subcategory: Subcategory, checked }) {
    const subcategory = $event.subcategory;
    const checked = $event.checked;

    if (checked.checked) {
      subcategory.checked = true;
      this.store.addSubcategory(subcategory);
    } else {
      subcategory.checked = false;
      this.store.removeSubcategory(subcategory);
    }
  }

  onSave() {
    this.addSubcategories().subscribe(response => {
      this.showSuccessDialog();
    });
  }

  onSaveAndClose() {
    this.addSubcategories().subscribe(response => {
      this.notificationService.success('Operazione effettuata con successo.');
      this.router.navigate(['']);
    });
  }

  private addSubcategories() {
    const state = this.store.getStateSnapshot();
    const idSubcategories = state.subcategories.map(subcat => subcat.id);
    this.loaderService.start();
    return this.simulationData.addSubcategories(state.simulation.id, idSubcategories)
      .pipe(
        tap({
          complete: () => {
            this.loaderService.stop();
            this.simulationService.handleSimulationSteps();
          },
          error: () => this.loaderService.stop()
        })
      );
  }

  showSuccessDialog() {
    const createDialog = this.dialogService.open(SimulationStatusDialogComponent, {
      width: '80%'
    });
    createDialog.onClose.subscribe(confirm => {
      if (confirm) {
        const simulationId = this.store.getStateSnapshot().simulation.id;
        this.router.navigate(['simulazione', simulationId, STEP_PATH[Step.DATA_PRICING]]);
      }
    });
  }

  isDisabled() {
    const state = this.store.getStateSnapshot();
    const statusSimulation = state.simulation.stato;
    const statusSteps = state.statusSteps;
    return statusSimulation.codice !== SimulationStatusEnum.WORK_IN_PROGRESS ||
     (statusSteps[Step.SUBCATEGORIES].status === StatusStep.COMPLETED);
  }

  onTextChange() {
    const filters = { fulltext: this.searchText };
    const event = { first: 0, rows: this.rowsForPage, sortField: null, sortOrder: null, filters };
    this.onPageChange(event);
  }

  onPageChange(event: LazyLoadEvent | any) {
    event.filters = { fulltext: this.searchText };
    this.onLazyLoad$.next(event);
  }

  private searchSubcategories(event: LazyLoadEvent | any) {
    let sort: 'asc' | 'desc';

    const rsql = new RSQLCriteria('query', 'sort', 'limit', 'totalCount', 'offset');
    rsql.includeTotalCount = false;
    if (event.filters && event.filters.fulltext) {
      const filters = event.filters;
      rsql.filters.and(new RSQLFilterExpression('descrizione', new IgnoreCaseOperator(), filters.fulltext));
    }
    if (event.sortField) {
      sort = (event.sortOrder === 1) ? 'asc' : 'desc';
      rsql.orderBy.add(event.sortField, sort);
    }
    rsql.pageNumber = Math.floor(event.first / event.rows);
    rsql.pageSize = event.rows;

    return this.subcategoriesService.getAll(rsql.build())
      .pipe(
        map(subcategories => ({
          ...subcategories,
          items: subcategories.items.map(subcat => ({
            ...subcat,
            flagCedole: subcat.modello.flagCedole,
            flagDataPricing: subcat.modello.flagDataPricing,
            flagParametriBlending: subcat.modello.flagParametriBlending
          }))
        })),
        catchError(error => of({
          items: [],
          count: 0,
          totalCount: 0,
          offset: 0,
          limit: 10
        }))
      );
  }

  private handleEvents() {
    this.subscriptions.push(this.simulationService.onSaveAndNext$.subscribe(this.onSave.bind(this)));
    this.subscriptions.push(this.simulationService.onSaveAndClose$.subscribe(this.onSaveAndClose.bind(this)));
  }

}
