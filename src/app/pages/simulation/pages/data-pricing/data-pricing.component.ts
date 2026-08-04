import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as Holidays from 'date-holidays';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { v1 as uuidv1 } from 'uuid';

import { NotificationService } from './../../../../core/notification.service';
import { SimulationDataService } from './../../../../core/simulation-data.service';
import { SimulationService } from './../../simulation.service';
import { SimulationStore } from './../../simulation.store';
import { STEP_PATH } from './../../../../shared/models/constants';
import { Curve, Step, StatusStep, SimulationStatusEnum } from './../../../../shared/models';
import { CurveEditDialogComponent } from './curve-edit-dialog/curve-edit-dialog.component';
import { SimulationStatusDialogComponent } from '../../components/simulation-status-dialog/simulation-status.dialog.component';
import { SubcategoryDataService } from '../../../../core/subcategory-data.service';


@Component({
  selector: 'App-data-pricing',
  templateUrl: './data-pricing.component.html',
  styleUrls: ['./data-pricing.component.scss']
})
export class DataPricingComponent implements OnInit, OnDestroy {

  curves$: Observable<Curve[]>;
  selectedDates$: Observable<Date[]>;
  nearestDataPricing: Date;
  invalidDates: Date[];
  calendarLocaleIt: any;
  dataEmissione: Date;

  private holidays: any;
  private editedCurves: Curve[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly store: SimulationStore,
    private readonly simulationService: SimulationService,
    private readonly simulationData: SimulationDataService,
    private readonly subcategoryDataService: SubcategoryDataService,
    private readonly notificationService: NotificationService,
    private readonly loaderService: NgxUiLoaderService,
    private readonly dialogService: DialogService,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly datePipe: DatePipe
  ) {
    this.curves$ = this.store.curves$.pipe(
      tap(el => {
        const state = this.store.getStateSnapshot();
        if (state.simulation && state.simulation.dataEmissione) {
          this.dataEmissione = moment(state.simulation.dataEmissione).toDate();
        }
      })
    );
    this.selectedDates$ = this.curves$
      .pipe(
        map(curves => Array.from(new Set(curves.map(curve => curve.dataPricing ? new Date(curve.dataPricing) : null)
          .filter(date => date)))),
        tap(dates => {
          if (dates && dates.length > 0) {
            const convertedDates = dates.map(el => el.getTime());
            const state = this.store.getStateSnapshot();
            this.nearestDataPricing = new Date(Math.max(...convertedDates));
            if (!state.simulation.dataEmissione) {
              this.dataEmissione = this.nearestDataPricing;
            }
          } else {
            this.dataEmissione = null;
            this.nearestDataPricing = null;
          }
        })
      );
    this.calendarLocaleIt = {
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
    this.store.setCurrentStep(Step.DATA_PRICING);
  }

  ngOnInit() {
    this.handleEvents();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onUnselectDate(date: Date) {
    this.store.removeCurveFromDate(date);
  }

  onSelectDate(date: Date) {
    const state = this.store.getStateSnapshot();
    const subcategories = state.subcategories.filter(subcat => subcat.flagDataPricing === true);
    this.getCurveByDate(date, subcategories.map(el => el.id))
      .subscribe(responses => {
        responses.forEach((response: any) => {
          response.items = response.items.map(item => {
            item.id = uuidv1();
            try {
              item.descrizione = this.datePipe.transform(item.descrizione, 'dd/MM/yyyy');
            } catch (e) {
              item.descrizione = item.descrizione;
            }
            return {
              ...item,
              flagCustom: false
            };
          });

          response.items
            .filter(item => moment(item.dataPricing).toLocaleString() !== moment(date).toLocaleString())
            .forEach(item => {
              const message = this.translateService.instant('SIMULATION.CURVE.WARNING_DOWNLOAD', {
                descrizione: subcategories.find(s => s.id === item.idSottocategoria).descrizione,
                dataRecuperata: this.datePipe.transform(item.dataPricing, 'dd/MM/yyyy'),
                dataRichiesta: this.datePipe.transform(date, 'dd/MM/yyyy')
              });
              this.notificationService.warning(message, 'Attenzione');
            });


          this.store.addCurve(response.items);

        });
      });
  }


  onDownloadChart() {
    const state = this.store.getStateSnapshot();
    const simulationId = state.simulation.id;
    const curves = state.curves;
    this.loaderService.start();
    if (this.isDisabled()) {
      this.simulationData.reportCurve(simulationId)
        .subscribe(
          response => this.loaderService.stop(),
          error => this.loaderService.stop()
        );
    } else {
      const sottocategorie = state.subcategories;
      this.simulationData.printCurve(simulationId, curves, sottocategorie)
        .subscribe(
          response => this.loaderService.stop(),
          error => this.loaderService.stop()
        );
    }
  }

  onDeleteCurve(curve: Curve) {
    this.store.deleteCurve(curve);
  }

  onEditColor(curve: Curve) {
    this.store.editCurve(curve);
  }

  onEditCurve(curve: Curve) {
    this.showDialog(curve, true).subscribe((editedCurve: Curve) => {
      if (editedCurve) {
        if (curve.flagCustom !== editedCurve.flagCustom) {
          this.editedCurves.push({
            ...curve,
            dettagli: curve.dettagli.map(dettaglio => (
              {
                dataRiferimento: dettaglio.dataRiferimento,
                valore: dettaglio.valore,
                tenor: dettaglio.tenor
              })
            )
          });
        } else if (this.editedCurves.some(el =>
          JSON.stringify(el.dettagli) === JSON.stringify(editedCurve.dettagli) && el.id === editedCurve.id)) {
          editedCurve.flagCustom = false;
        }
        this.store.editCurve(editedCurve);
      }
    });
  }

  onAddCurve(curve: Curve) {
    this.showDialog(curve, false, true).subscribe((generatedCurve: Curve) => {
      if (generatedCurve) {
        this.store.addCurve([generatedCurve]);
      }
    });
  }

  onSave() {
    this.associateCurves().subscribe(response => {
      this.showSuccessDialog();
    });
  }

  onSaveAndClose() {
    this.associateCurves()
    .subscribe(response => {
      this.notificationService.success('Operazione completata con successo.');
      this.router.navigate(['']);
    });
  }

  isDisabled() {
    const state = this.store.getStateSnapshot();
    const statusSimulation = state.simulation.stato;
    const statusSteps = state.statusSteps;
    return statusSimulation.codice !== SimulationStatusEnum.WORK_IN_PROGRESS ||
     (statusSteps[Step.DATA_PRICING].status === StatusStep.COMPLETED);
  }

  private showSuccessDialog() {
    const createDialog = this.dialogService.open(SimulationStatusDialogComponent, {
      width: '80%'
    });
    createDialog.onClose.subscribe(confirm => {
      if (confirm) {
        const simulationId = this.store.getStateSnapshot().simulation.id;
        this.router.navigate(['simulazione', simulationId, STEP_PATH[Step.BLENDING_PARAMS]]);
      }
    });
  }

  private showDialog(curve?: Curve, isInEdit = false, isChoosing = false) {
    const createDialog = this.dialogService.open(CurveEditDialogComponent, {
      width: '80%',
      data: {
        isInEdit,
        isChoosing,
        selectedCurve: curve
      }
    });
    return createDialog.onClose;
  }

  private associateCurves() {
    this.loaderService.start();
    const state = this.store.getStateSnapshot();
    const simulation = state.simulation;
    const dataEmissione = this.dataEmissione;
    return this.simulationData.associateCurves(simulation.id, state.curves, dataEmissione)
    .pipe(
      tap({
        complete: () => {
          this.loaderService.stop();
          this.store.setSimulation({ ...simulation, dataEmissione });
          this.simulationService.handleSimulationSteps();
        },
        error: () => this.loaderService.stop()
      })
    );
  }

  private getCurveByDate(date: Date, idSubcategories: string[]) {
    this.loaderService.startLoader('data-pricing');
    return this.subcategoryDataService.getCurveByDate(date, idSubcategories)
    .pipe(
      tap({
        complete: () => this.loaderService.stopLoader('data-pricing'),
        error: () => this.loaderService.stopLoader('data-pricing')
      })
    );
  }

  private handleEvents() {
    this.subscriptions.push(this.simulationService.onSaveAndNext$.subscribe(this.onSave.bind(this)));
    this.subscriptions.push(this.simulationService.onSaveAndClose$.subscribe(this.onSaveAndClose.bind(this)));
  }
}
