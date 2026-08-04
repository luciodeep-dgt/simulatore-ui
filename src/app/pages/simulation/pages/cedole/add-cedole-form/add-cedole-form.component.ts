import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as R from 'ramda';
import { map, tap } from 'rxjs/operators';
import { v1 as uuidv1 } from 'uuid';
import { CedoleService } from './../cedole.service';
import { SimulationStore } from './../../../simulation.store';
import { Step, StatusStep } from './../../../../../shared/models/step.enum';
import { NotificationService } from './../../../../../core/notification.service';
import { Subcategory, Cedola, SimulationStatusEnum } from './../../../../../shared/models';


@Component({
  selector: 'app-add-cedole-form',
  templateUrl: './add-cedole-form.component.html',
  styleUrls: ['./add-cedole-form.component.scss']
})
export class AddCedoleFormComponent implements OnInit {

  @Input() cedola?: Cedola;
  @Input() subcategories: Subcategory[];
  @Input() showDeleteButton: boolean;
  @Input() index?: number;
  @Output() deleteCedola = new EventEmitter<Cedola>();

  cedoleTab: { header: string, value?: any }[];

  constructor(
    private readonly loaderService: NgxUiLoaderService,
    private readonly cedoleService: CedoleService,
    private readonly store: SimulationStore,
    private readonly notificationService: NotificationService
  ) {

  }

  ngOnInit() {
    this.cedoleTab = this.subcategories.map(subcategory => (
      {
        header: subcategory.descrizione,
        value: subcategory
      }
    ));
  }

  isDisabled() {
    const state = this.store.getStateSnapshot();
    const statusSimulation = state.simulation.stato;
    const statusSteps = state.statusSteps;
    return statusSimulation.codice !== SimulationStatusEnum.WORK_IN_PROGRESS ||
     (statusSteps[Step.CEDOLE].status === StatusStep.COMPLETED);
  }

  onUploadFile($event) {
    this.cedoleService.upload($event.files[0])
      .pipe(
        map(response => {
          const cedola = response.cedola;
          cedola.id = uuidv1();
          cedola.prodotti = this.getSottocategorieDetailId(cedola);
          return cedola;
        }),
        tap((cedola: any) => {
          cedola.descrizione = this.cedola.descrizione;
          cedola.id = this.cedola.id;
          const hashOldCedolaDates = JSON.stringify(
            R.flatten(this.cedola.prodotti.map(prodotto => prodotto.tassi.map(tasso => tasso.dataRiferimento.getTime())))
          );
          const hashNewCedolaDates = JSON.stringify(
            R.flatten(cedola.prodotti.map(prodotto => prodotto.tassi.map(tasso => tasso.dataRiferimento.getTime())))
          );
          if (hashOldCedolaDates !== hashNewCedolaDates) {
            this.notificationService.error('Non puoi aggiungere le date diverse da quelle indicate', 'Errore');
          } else {
            this.notificationService.success('Hai importato il file correttamente.');
            this.store.editCedola(this.cedola.id, cedola);
          }
        })
      )
      .subscribe();
  }

  getSottocategorieDetailId(cedola: Cedola) {
    return cedola.prodotti.map(subcat => {
      return {
        ...subcat,
        tassi: subcat.tassi
          .map(detail => ({
            ...detail, id: uuidv1(), idProdotto: subcat.id,
            idCedola: this.cedola.id, dataRiferimento: new Date(detail.dataRiferimento)
          }))
      };
    });
  }

  onDownloadCedole() {
    this.loaderService.start();
    const state = this.store.getStateSnapshot();
    this.cedoleService.downloadCedole(state.simulation.id, this.cedola)
    .subscribe(
      response => this.loaderService.stop(),
      error => this.loaderService.stop()
    );
  }

  onDeleteCedola() {
    this.deleteCedola.emit(this.cedola);
  }

  onSave($event) {
    // debugger;
    // if (this.simulationService.validationForms && this.simulationService.validationForms[this.index]) {
    //   this.simulationService.validationForms[this.index] = $event;
    // } else {
    //   this.simulationService.validationForms = [$event];
    // }
  }
}
