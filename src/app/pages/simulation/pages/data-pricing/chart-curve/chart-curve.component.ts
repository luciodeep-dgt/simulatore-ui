import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { UIChart } from 'primeng';
import * as R from 'ramda';
import { Curve } from './../../../../../shared/models';
import TintGeneratorHelper from 'src/app/shared/helpers/tint-generator.helper';


@Component({
  selector: 'app-chart-curve',
  templateUrl: './chart-curve.component.html',
  styleUrls: ['./chart-curve.component.scss']
})
export class ChartCurveComponent implements OnInit, OnChanges {

  @ViewChild('chart', { static: true }) chart: UIChart;
  @Input() curves: Curve[];
  @Input() colors: any;
  @Input() keyCurve?: string;

  plugins: any[];
  dataCurves: any;
  xAxesLabels: any[];

  constructor() { }

  ngOnInit() {
    this.plugins = [(window as any).ChartZoom];
  }

  ngOnChanges() {
    this.buildChartData();
  }


  private buildChartData() {
    this.dataCurves = {
      datasets: this.curves.map((curve) => ({
        label: curve.descrizione,
        borderColor: curve.colore,
        backgroundColor: TintGeneratorHelper.hexToRgba(curve.colore, 0.1),
        showLine: true,
        data: curve.dettagli.map(detail => ({ x: detail.dataRiferimento, y: detail.valore }))
      }))
    };
    this.xAxesLabels = R.uniq( R.flatten(this.curves.map(c => c.dettagli.map(d => d.tenor ? d.tenor : ''))) );
  }

  get options() {
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
          type: 'category', // time
          labels: this.xAxesLabels,
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
            callback: (value, index, values) => value.toFixed(2).toString().substring(0, 4) + '%'
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
            const item = dataset.data[tooltipItems.index];
            return `${tooltipItems.xLabel} (${item.x}): ${tooltipItems.yLabel}%`;
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
