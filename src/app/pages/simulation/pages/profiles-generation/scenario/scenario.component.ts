import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UIChart } from 'primeng';
import * as R from 'ramda';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { ScenariService } from './../scenari.service';
import { SimulationStore } from './../../../simulation.store';
import { Scenario, TipoScenario, TipoValoreDettaglioScenario, TipoMaturity } from './../../../../../shared/models/scenario.model';
import TintGeneratorHelper from '../../../../../shared/helpers/tint-generator.helper';


@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScenarioComponent implements OnInit {

  @ViewChild('chart', { static: true }) chart: UIChart;
  @Input() scenario: Scenario;
  @Input() readonly = false;
  @Output() validate: EventEmitter<any> = new EventEmitter<any>();

  plugins = [(window as any).ChartZoom];
  chartOption: any;
  chart$: Observable<any>;
  tipologieScenario$: Observable<TipoScenario[]>;
  tipologieValore$: Observable<TipoValoreDettaglioScenario[]>;
  tipologieMaturity$: Observable<TipoMaturity[]>;

  selectedTipologieScenario: TipoScenario[];
  selectedTipologieValore: TipoValoreDettaglioScenario[];
  selectedTipologieMaturity: string;

  // da rimuovere con le form reactive
  private changeTipologiaScenario = new BehaviorSubject<any>(null);
  private changeTipologiaValore = new BehaviorSubject<any>(null);
  private changeTipologiaMaturity = new BehaviorSubject<any>(null);
  private onChangeTipologiaScenario$  = this.changeTipologiaScenario.asObservable();
  private onChangeTipologiaValore$ = this.changeTipologiaValore.asObservable();
  private onChangeTipologiaMaturity$  = this.changeTipologiaMaturity.asObservable();
  //

  constructor(
    private readonly loaderService: NgxUiLoaderService,
    private readonly scenariService: ScenariService,
    private readonly store: SimulationStore,
  ) { }

  ngOnInit() {
    this.chart$ = this.getChartData();
    this.tipologieScenario$ = this.scenariService.getTipologieScenario(this.scenario)
      .pipe(tap(tipologie => this.onChangeTipologiaScenario([tipologie[0]]) ));
    this.tipologieValore$ = this.scenariService.getTipologieValore()
      .pipe(tap(tipologie => this.onChangeTipologiaValore(tipologie) ));
    this.tipologieMaturity$ = this.scenariService.getTipologieMaturity()
      .pipe(tap(tipologie => this.onChangeTipologiaMaturity(tipologie[2].codice) ));
  }

  onChangeTipologiaScenario(tipologie: TipoScenario[]) {
    this.selectedTipologieScenario = tipologie;
    const value = R.isEmpty(tipologie) ? [] : tipologie.map(t => t.id);
    this.changeTipologiaScenario.next(value);
  }

  onChangeTipologiaValore(tipologie: TipoValoreDettaglioScenario[]) {
    this.selectedTipologieValore = tipologie;
    const value = R.isEmpty(tipologie) ? [] : tipologie.map(t => t.codice);
    this.changeTipologiaValore.next(value);
  }

  onChangeTipologiaMaturity(tipologie: string) {
    this.selectedTipologieMaturity = tipologie;
    this.changeTipologiaMaturity.next(tipologie);
  }

  getChartData() {
    return combineLatest(
      this.onChangeTipologiaScenario$,
      this.onChangeTipologiaValore$,
      this.onChangeTipologiaMaturity$
    )
    .pipe(
      map((filters: any[]) => {
        const tipologieScenario = filters[0];
        const tipologieValore = filters[1];
        const tipologieMaturity = filters[2];

        const datasets = R.flatten(
          R.filter(
            contenitore => R.contains(contenitore.tipologia.id, tipologieScenario),
            this.scenario.contenitori
          )
          .map(contenitore => {
            const colori = [
              TintGeneratorHelper.shadeColor(contenitore.tipologia.colore, -33),
              contenitore.tipologia.colore,
              TintGeneratorHelper.shadeColor(contenitore.tipologia.colore, 33),
            ];
            return R.pickBy(
              (val, key) => R.contains(key, tipologieValore),
              R.groupBy(
                R.prop('tipologiaValore'),
                R.flatten(contenitore.dettagli
                  .filter(dettaglio => dettaglio.tenor === tipologieMaturity)
                  .map(dettaglio => {
                    const upper = {
                      x: moment(dettaglio.dataRiferimento), y: dettaglio.upperValue,
                      colore: colori[0], tipologiaValore: 'UPPER'
                    };
                    const middle = {
                      x: moment(dettaglio.dataRiferimento), y: dettaglio.middleValue,
                      colore: colori[1], tipologiaValore: 'MIDDLE'
                    };
                    const lower = {
                      x: moment(dettaglio.dataRiferimento), y: dettaglio.lowerValue,
                      colore: colori[2], tipologiaValore: 'LOWER'
                    };
                    return [ upper, middle, lower ];
                  })
                )
              )
            );
          })
          .map(element =>
              Object.keys(element).map((key, index) => {
                const data = element[key];
                return {
                  label: 'Dataset ' + index,
                  borderColor: data[0].colore,
                  backgroundColor: TintGeneratorHelper.hexToRgba(data[0].colore, 0.1),
                  showLine: true,
                  data
                };
              })
          )
        );

        return { datasets };
      }),
      tap(chartData => {
        this.chartOption = this.getChartOptions(chartData);
      })
    );
  }

  getChartOptions(chartData: any) {
    return {
      legend: {
        display: false,
        labels: {
          usePointStyle: true
        },
        align: 'start'
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          time: {
            tooltipFormat: 'DD-MM-YYYY'
          },
          type: 'time', // category
          // distribution: 'series',
          ticks: {
            maxRotation: 0,
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          }
        }],
        yAxes: [{
          ticks: {
            autoSkip: true,
            callback: (value, index, values) => value.toString().substring(0, 6) + '%'
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          }
        }],
      },
      tooltips: {
        callbacks: {
          label: (tooltipItems, data) => {
            const dataset = data.datasets[tooltipItems.datasetIndex];
            const label = tooltipItems.index === (dataset.data.length - 1) ?
              `${tooltipItems.label}: % a scadenza IVA: ${tooltipItems.yLabel}%` :
              `${tooltipItems.label}: ${tooltipItems.yLabel}%`;
            return label;
          }
        }
      },
      pan: {
        enabled: true,
        mode: 'xy',
        speed: 20,
        threshold: 10,
      },
      zoom: {
        enabled: true,
        mode: 'xy',
        speed: 0.1,
        threshold: 10,
      },
    };
  }

}
