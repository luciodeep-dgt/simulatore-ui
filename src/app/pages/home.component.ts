import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './../../core/notification.service';
import { SimulationDataService } from './../../core/simulation-data.service';
import { DialogService } from 'primeng';
import { CreateSimulationDialogComponent } from './components/create-simulation-dialog/create-simulation.dialog.component';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    public dialogService: DialogService,
    private readonly notificationService: NotificationService,
    private readonly simulationService: SimulationDataService
  ) { }

  ngOnInit() {

  }

  onShowDialog() {
    const createDialog = this.dialogService.open(CreateSimulationDialogComponent, {
      width: '80%',
      styleClass: 'add-simulation-dialog'
    });
    createDialog.onClose.subscribe(description => {
      if (description) {
        this.onCreateSimulation(description);
      }
    });
  }

  onCreateSimulation(description: string) {
    console.log(description);
    this.simulationService.createByDescription(description)
      .subscribe(createdSimulation => {
        this.notificationService.success('Simulazione creata correttamente.');
        this.router.navigate(['simulazione', createdSimulation.id]);
      }, (error: HttpErrorResponse) => {
        this.notificationService.error(error.error.message || 'Errore durante la creazione della simulazione.');
      });
  }

}
