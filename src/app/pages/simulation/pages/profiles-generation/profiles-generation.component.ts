import { Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { Observable, Subscription, race } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';

import { SimulationStore } from './../../simulation.store';
import { ScenariService } from './scenari.service';
import { Step, StatusStep, SimulationStatusEnum } from '../../../../shared/models';
import { SimulationDataService } from '../../../../core/simulation-data.service';
import { SimulationService } from '../../simulation.service';


@Component({
  selector: 'app-profiles-generation',
  templateUrl: './profiles-generation.component.html',
  styleUrls: ['./profiles-generation.component.scss'],
})
export class ProfilesGenerationComponent implements OnInit, OnDestroy, AfterViewInit {

  isDownloadDisabled = true;
  accordions$: Observable<any[]>;
  scenariDaValidare: number[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly loaderService: NgxUiLoaderService,
    private readonly router: Router,
    private readonly simulationService: SimulationService,
    private readonly simulationDataService: SimulationDataService,
    private readonly scenariService: ScenariService,
    private readonly store: SimulationStore,
    private readonly translateService: TranslateService,
  ) {
    this.store.setCurrentStep(Step.PROFILES);
  }

  ngOnInit() {
    this.handleEvents();

    const simulation = this.store.getStateSnapshot().simulation;
    this.accordions$ = (this.isDisabled() ?
        this.store.profiles$ :
        this.simulationDataService.getScenari(simulation.id).pipe(map((res: any) => res.items))
      )
      .pipe(
        tap(scenari => this.isDownloadDisabled = !scenari.some(s => s.stato.codice === 'ELABORATO')),
        map(scenari => scenari.map(el => ({
          header: el.descrizione,
          content$: this.loadScenarioTab(el.id)
        }))
      ));
  }

  ngAfterViewInit() {
    // bug Primeng: https://github.com/primefaces/primeng/issues/8153
    // setTimeout(
    //   () => {
    //     document.querySelectorAll('p-accordiontab a')[0]
    //     .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    //   }, 300
    // );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  confirm() {
    this.confirmationService.confirm({
      header: 'Attenzione!',
      message: this.translateService.instant('SIMULATION.PROFILI.WARNING_DIALOG'),
      icon: null,
      accept: () => {
        this.loaderService.start();
        const state = this.store.getStateSnapshot();
        this.simulationDataService.publish(state.simulation.id, this.scenariDaValidare)
        .subscribe(
          success => { this.loaderService.stop(); this.router.navigate(['']); },
          error => this.loaderService.stop()
        );
      }
    });
  }

  onSave() {
    this.confirm();
  }

  onSaveAndClose() {
    this.confirm();
  }

  isDisabled() {
    const state = this.store.getStateSnapshot();
    const statusSimulation = state.simulation.stato;
    const statusSteps = state.statusSteps;
    return statusSimulation.codice !== SimulationStatusEnum.WORK_IN_PROGRESS ||
     (statusSteps[Step.PROFILES].status === StatusStep.COMPLETED);
  }

  onValidateScenario(event: { idScenario: number, validated: boolean }) {
    const found = this.scenariDaValidare.find(s => s === event.idScenario);
    if (event.validated) {
      if (!found) {
        this.scenariDaValidare.push(event.idScenario);
      }
    } else {
      this.scenariDaValidare = this.scenariDaValidare.filter(s => s !== found);
    }
  }

  onDownloadScenari() {
    const state = this.store.getStateSnapshot();
    const idSimulation = state.simulation.id;
    this.loaderService.start();
    this.simulationDataService.reportScenari(idSimulation)
    .subscribe(
      response => this.loaderService.stop(),
      error => this.loaderService.stop()
    );
  }

  private loadScenarioTab(idScenario: string | number) {
    return Observable.create(observer => {
      this.loaderService.start();
      return observer.next(idScenario);
    })
    .pipe(switchMap((value: string | number) =>
      this.scenariService.getById(value)
      .pipe(
        tap(_ => this.loaderService.stop()),
        catchError(error => {
          this.loaderService.stop();
          return error;
        })
      ))
    );
  }

  private handleEvents() {
    this.subscriptions.push(this.simulationService.onSaveAndNext$.subscribe(this.onSave.bind(this)));
    this.subscriptions.push(this.simulationService.onSaveAndClose$.subscribe(this.onSaveAndClose.bind(this)));
  }

}
