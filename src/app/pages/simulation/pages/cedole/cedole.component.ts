import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as R from 'ramda';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { map, tap, take, distinct, switchMap, catchError } from 'rxjs/operators';
import { v1 as uuidv1 } from 'uuid';
import * as Holidays from 'date-holidays';

import { SimulationService } from './../../simulation.service';
import { SimulationStatusDialogComponent } from './../../components/simulation-status-dialog/simulation-status.dialog.component';
import { SimulationDataService } from './../../../../core/simulation-data.service';
import { NotificationService } from './../../../../core/notification.service';
import { SimulationStore } from './../../simulation.store';
import { STEP_PATH } from './../../../../shared/models/constants';
import { StatusStep } from './../../../../shared/models/step.enum';
import { Step, Subcategory, Cedola, SimulationStatusEnum } from '../../../../shared/models';
import { SubcategoryDataService } from '../../../../core/subcategory-data.service';


@Component({
  selector: 'app-cedole',
  templateUrl: './cedole.component.html',
  styleUrls: ['./cedole.component.scss']
})
export class CedoleComponent implements OnInit, OnDestroy {
  calendarLocale;
  dataEmissioneEmpty = true;
  dataEmissione: Date = null;
  dataEmissioneDisabled = false;
  invalidDates: Date[];
  hasError = false;

  subcategories$: Observable<Subcategory[]>;
  cedole$: Observable<Cedola[]>;
  cedoleToEdit$: Observable<Cedola[]>;
  // taxTypologies$: Observable<any>;

  private holidays: any;
  private subscriptions: Subscription[] = [];

  showDeleteButton = false;

  constructor(
    private readonly dialogService: DialogService,
    private readonly loaderService: NgxUiLoaderService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly simulationDataService: SimulationDataService,
    private readonly simulationService: SimulationService,
    private readonly subcategoryDataService: SubcategoryDataService,
    private store: SimulationStore,
  ) {
    this.store.setCurrentStep(Step.CEDOLE);
    this.calendarLocale = {
      firstDayOfWeek: 1,
      dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
      dayNamesMin: ['D', 'L', 'M', 'M', 'G', 'V', 'S'],
      monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre',
        'Ottobre', 'Novembre', 'Dicembre'],
      monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      today: 'Oggi',
      clear: 'Cancella'
    };
    this.holidays = new Holidays('IT');
    this.invalidDates = this.holidays.getHolidays(new Date().getFullYear().toString()).map(holiday => new Date(holiday.date));
    // this.taxTypologies$ = this.taxTypeService.getAll().pipe(map(el => el.items.map(item => ({ label: item.descrizione, value: item }))));
  }

  ngOnInit() {
    this.subcategories$ = this.store.subcategories$;

    const stateSnapshot = this.store.getStateSnapshot();
    const dataEmissioneTMP = stateSnapshot.simulation.dataEmissione;
    if (dataEmissioneTMP) {
      this.dataEmissioneDisabled = true;
      this.dataEmissione = new Date(dataEmissioneTMP);
      this.start(dataEmissioneTMP);
    }
  }

  onSelectData(event) {
    this.dataEmissione = event;
    this.start(event);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSave() {
    this.saveCedole().subscribe(response => {
      this.showSuccessDialog();
    });
  }

  start(dataEmissione: Date) {
    this.dataEmissioneEmpty = !dataEmissione;
    this.loadCedole(dataEmissione);
    this.handleEvents();
  }

  onSaveAndClose() {
    this.saveCedole().subscribe(response => {
      this.notificationService.success('Operazione completata con successo.');
      this.router.navigate(['']);
    });
  }

  isDisabled() {
    const state = this.store.getStateSnapshot();
    const statusSimulation = state.simulation.stato;
    const statusSteps = state.statusSteps;
    return statusSimulation.codice !== SimulationStatusEnum.WORK_IN_PROGRESS ||
     (statusSteps[Step.CEDOLE].status === StatusStep.COMPLETED);
  }

  private saveCedole() {
    const state = this.store.getStateSnapshot();
    const checkTassiFn = tasso => isNaN(tasso.valoreEffettivo) || isNaN(tasso.valoreEffettivo);
    if ( !state.cedole || state.cedole.some(cedola => cedola.prodotti.some(prodotto => prodotto.tassi.some(checkTassiFn))) ) {
      this.notificationService.error('Compila i campi obbligatori');
      return throwError('Compila i campi obbligatori');
    }
    this.loaderService.start();
    return this.cedole$.pipe(
      take(1),
      switchMap(cedole => {
        return this.simulationDataService.setCedole(state.simulation.id, cedole, this.dataEmissione )
        .pipe(
          tap({
            complete: () => {
              this.loaderService.stop();
              this.simulationService.handleSimulationSteps();
            },
            error: () => this.loaderService.stop()
          })
        );
      })
    );
  }

  private loadCedole(dataEmissione: Date) {
    this.cedole$ = this.store.cedole$
      .pipe(
        map((cedole: Cedola[]) => {
          if (!cedole) { return []; }
          const storeState = this.store.getStateSnapshot();
          const manyCedoleAdmitted = storeState.subcategories.length === 1;
          if (!manyCedoleAdmitted) {
            cedole = [
              {
                ...cedole[0],
                prodotti: cedole.map(cedola => cedola.prodotti).reduce((accumulator, value) => accumulator.concat(value), [])
              }
            ];
          } else {
            cedole = cedole.filter(cedola => cedola.prodotti.find(subcat => subcat.id === storeState.subcategories[0].id));
          }
          return cedole.map((item,index) => ({...item, descrizione: `Scenario tassi ${index + 1}`}));
        }),
        tap(cedole => {
          const storeState = this.store.getStateSnapshot();
          this.showDeleteButton = cedole && cedole.length > 1 && storeState.subcategories.length === 1;
        })
      );
    this.cedoleToEdit$ = this.store.cedoleToView$.pipe(
      distinct(),
      map((cedole: Cedola[]) => {
        if (!cedole) { return []; }
        const storeState = this.store.getStateSnapshot();
        const manyCedoleAdmitted = storeState.subcategories.length === 1;
        if (!manyCedoleAdmitted) {
          cedole = [
            {
              ...cedole[0],
              descrizione: 'Scenario tassi 1',
              prodotti: cedole.map(cedola => cedola.prodotti).reduce((accumulator, value) => accumulator.concat(value), [])
            }
          ];
        } else {
          cedole = cedole.filter(cedola => cedola.prodotti.find(subcat => subcat.id === storeState.subcategories[0].id))
            .map((cedola, index) => ({ ...cedola, descrizione: 'Scenario tassi ' + (index + 1) }));
        }
        return cedole;
      })
    );
    const state = this.store.getStateSnapshot();

    const subcategories = state.subcategories.filter(subcat => subcat.flagCedole === true).map(el => el.id);
    const mockRequest = this.subcategoryDataService.getCedoleBySubcategories(dataEmissione, subcategories)
      .pipe(
        map(responses => R.flatten(responses.map(response => response.items)) as Cedola[]),
        tap(() => this.hasError = false),
        catchError(() => {
          this.hasError = true;
          return of( [] as Cedola[] );
        })
      );

    const subscription = (!state.cedole) ? mockRequest : this.store.cedole$;
    this.loaderService.start();
    this.subscriptions.push(
      subscription
        .pipe(
          // map(responses => R.flatten(responses.map(response => response.items)) as Cedola[]),
          // filter((cedole:Cedola[]) => !R.isEmpty(cedole)),
          map(cedole => {
            return cedole
              .map(cedola => ({ ...cedola, id: uuidv1() }))
              .map(cedola => ({ ...cedola, prodotti: this.getSottocategorieDetailId(cedola) }));
          }),
          tap(cedole => {
            if (!state.cedole && !R.isEmpty(cedole)) {
              this.store.setCedole(cedole);
              this.store.addDataEmissione(this.dataEmissione);
            }
          })
        )
        .subscribe(
          response => this.loaderService.stop(),
          error => this.loaderService.stop()
        )
    );
  }

  private showSuccessDialog() {
    const createDialog = this.dialogService.open(SimulationStatusDialogComponent, {
      width: '80%'
    });
    createDialog.onClose.subscribe(confirm => {
      if (confirm) {
        const simulationId = this.store.getStateSnapshot().simulation.id;
        this.router.navigate(['simulazione', simulationId, STEP_PATH[Step.PROFILES]]);
      }
    });
  }

  getSottocategorieDetailId(cedola: Cedola) {
    return cedola.prodotti.map(subcat => {
      return {
        ...subcat,
        tassi: subcat.tassi
          .map(detail => ({
            ...detail, id: uuidv1(), idProdotto: subcat.id,
            idCedola: cedola.id, dataRiferimento: new Date(detail.dataRiferimento)
          }))
      };
    });
  }

  isAddDisabled() {
    const state = this.store.getStateSnapshot();
    return state.subcategories.length > 1 || (state.cedole && state.cedole.length >= 5) ||
      (state.curves && state.curves.length > 1) || this.isDisabled();
  }

  onClickAdd() {
    if (this.isAddDisabled()) {
      return;
    }
    const storeCedole = this.store.getStateSnapshot().cedole;
    const cedola = { ...storeCedole[storeCedole.length - 1] };
    cedola.id = uuidv1();
    let prodottiArray = [];
    cedola.prodotti.forEach(prodotto => {
      const nuovoProdotto = {
        ...prodotto,
        tassi: prodotto.tassi
          .map(tasso => ({ ...tasso, valoreNominale: null, valoreEffettivo: null, idCedola: cedola.id, id: cedola.id }))
      };

      prodottiArray = [
        ...prodottiArray,
        nuovoProdotto
      ];
    });
    cedola.prodotti = prodottiArray;
    this.store.addCedola(cedola);
  }

  onDeleteCedola(cedola: Cedola) {
    this.store.deleteCedola(cedola);
  }

  private handleEvents() {
    this.subscriptions.push(this.simulationService.onSaveAndNext$.subscribe(this.onSave.bind(this)));
    this.subscriptions.push(this.simulationService.onSaveAndClose$.subscribe(this.onSaveAndClose.bind(this)));
  }

}
