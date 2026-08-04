import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogService } from 'primeng';

import { DataService } from './../../../../core/data.service';
import { BLENDINGS_SERVICE } from './../../../../core/data-services';
import { STEP_PATH } from './../../../../shared/models/constants';
import { NotificationService } from './../../../../core/notification.service';
import { SimulationDataService } from './../../../../core/simulation-data.service';
import { SimulationService } from './../../simulation.service';
import { SimulationStore } from './../../simulation.store';
import { StatusStep } from './../../../../shared/models/step.enum';
import { BlendingParam, Pageable, Step, SimulationStatusEnum } from './../../../../shared/models';
import { SimulationStatusDialogComponent } from '../../components/simulation-status-dialog/simulation-status.dialog.component';


@Component({
  selector: 'app-blending-params',
  templateUrl: './blending-params.component.html',
  styleUrls: ['./blending-params.component.scss']
})
export class BlendingParamsComponent implements OnInit, OnDestroy {

  blendingParams$: Observable<Pageable<BlendingParam>>;
  selectedParams$: Observable<BlendingParam>;

  error: HttpErrorResponse;

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly store: SimulationStore,
    private readonly simulationService: SimulationService,
    private readonly simulationData: SimulationDataService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly notification: NotificationService,
    @Inject(BLENDINGS_SERVICE) private blendingService: DataService<BlendingParam>
  ) {
    this.store.setCurrentStep(Step.BLENDING_PARAMS);
    this.selectedParams$ = this.store.blendingParams$;
  }

  ngOnInit() {
    this.handleEvents();
    this.blendingParams$ = this.blendingService.getAll()
      .pipe(
        catchError(err => {
          this.error = err;
          return throwError(err);
        })
      );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onModelChange($event) {
    const blending = new BlendingParam();
    blending.id = $event;
    this.store.setBlendingParams(blending);
  }

  onSave() {
    const state = this.store.getStateSnapshot();
    if (state.blendingParams) {
      this.simulationData.addBlending(state.simulation.id, state.blendingParams.id)
      .subscribe(response => {
        this.simulationService.handleSimulationSteps();
        this.showSuccessDialog();
      });
    } else {
      this.notification.error('Selezionare un parametro di blending per poter proseguire.');
    }
  }

  onSaveAndClose() {
    const state = this.store.getStateSnapshot();
    if (state.blendingParams) {
      this.simulationData.addBlending(state.simulation.id, state.blendingParams.id).subscribe(response => {
        this.notificationService.success('Operazione completata con successo.');
        this.router.navigate(['']);
      });
    } else {
      this.notification.error('Selezionare un parametro di blending per poter proseguire.');
    }
  }

  isDisabled() {
    const state = this.store.getStateSnapshot();
    const statusSimulation = state.simulation.stato;
    const statusSteps = state.statusSteps;
    return statusSimulation.codice !== SimulationStatusEnum.WORK_IN_PROGRESS ||
     (statusSteps[Step.BLENDING_PARAMS].status === StatusStep.COMPLETED);
  }

  private showSuccessDialog() {
    const createDialog = this.dialogService.open(SimulationStatusDialogComponent, {
      width: '80%'
    });
    createDialog.onClose.subscribe(confirm => {
      if (confirm) {
        const simulationId = this.store.getStateSnapshot().simulation.id;
        this.router.navigate(['simulazione', simulationId, STEP_PATH[Step.CEDOLE]]);
      }
    });
  }

  private handleEvents() {
    this.subscriptions.push(this.simulationService.onSaveAndNext$.subscribe(this.onSave.bind(this)));
    this.subscriptions.push(this.simulationService.onSaveAndClose$.subscribe(this.onSaveAndClose.bind(this)));
  }

}
