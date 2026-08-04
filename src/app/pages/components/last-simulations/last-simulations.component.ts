import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Simulation, Pageable } from '../../../../shared/models';
import { SimulationDataService } from './../../../../core/simulation-data.service';


@Component({
  selector: 'app-last-simulations',
  templateUrl: './last-simulations.component.html',
  styleUrls: ['./last-simulations.component.scss']
})
export class LastSimulationsComponent implements OnInit {

  lastSimulations$: Observable<Pageable<Simulation>>;
  error: HttpErrorResponse;

  constructor(
    private readonly loaderService: NgxUiLoaderService,
    private readonly simulationService: SimulationDataService
  ) { }

  ngOnInit() {
    this.loaderService.startLoader('last-simulations');
    this.lastSimulations$ = this.simulationService.getLatest()
    .pipe(
      tap({
        error: (err) => {
          this.error = err;
          this.loaderService.stopLoader('last-simulations');
        },
        complete: () => this.loaderService.stopLoader('last-simulations')
      })
    );
  }

}
