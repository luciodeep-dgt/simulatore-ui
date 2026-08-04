import { CedolaChangeModel } from './../../../../../shared/models/cedola.model';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgModel } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy, ViewChild, } from '@angular/core';
import { SimulationService } from './../../../simulation.service';
import { SimulationStore } from './../../../simulation.store';
import { Subcategory, Cedola, CedolaDetail } from './../../../../../shared/models';


@Component({
  selector: 'app-cedola-form',
  templateUrl: './cedola-form.component.html',
  styleUrls: ['./cedola-form.component.scss']
})
export class CedolaFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() disabled = false;
  @Input() cedola?: Cedola;
  @Input() subcategory?: Subcategory;
  @Output() changeTypology = new EventEmitter<any>();
  @Output() upload = new EventEmitter<any>();
  @Output() downloadCedole = new EventEmitter<any>();
  @Output() submit = new EventEmitter<boolean>();
  @Output() submitAndClose = new EventEmitter<boolean>();
  @ViewChild('valoreNominale', { static: false }) valoreNominale: NgModel;
  @ViewChild('valoreEffettivo', { static: false }) valoreEffettivo: NgModel;
  currentCedolaDetail: CedolaDetail[];
  formSubmitted = false;
  settings: any;

  private maxLengthPad = 20;
  private subscriptions: Subscription[] = [];
  modelChanged: Subject<CedolaChangeModel> = new Subject<CedolaChangeModel>();

  constructor(
    private store: SimulationStore,
    private readonly simulationService: SimulationService,
  ) {
    this.settings = {
      mask: '[s]0.00000000000000000',
      definitions: {
        's': /-/
      },
      // mask: Number,
      scale: 17,
      signed: true,
      max: 9,
      padFractionalZeros: true,
      min: -9,
      normalizeZeros: true
    };

    this.modelChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((model: CedolaChangeModel) => this.updateStore(model) );
  }

  ngOnInit() {
    this.handleEvents();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnChanges() {
    this.generateCurrentDetailToEdit();
  }

  onDownloadCedole() {
    this.downloadCedole.emit();
  }

  onSave() {
    this.formSubmitted = true;
    this.submit.emit(this.valoreEffettivo.valid && this.valoreNominale.valid);
  }

  onSaveAndClose() {
    this.formSubmitted = true;
    this.submitAndClose.emit(this.valoreEffettivo.valid && this.valoreNominale.valid);
  }

  private generateCurrentDetailToEdit() {
    if (this.cedola) {
      const detailFound = this.cedola.prodotti
        .find(subcat => subcat.id === this.subcategory.id);
      this.currentCedolaDetail = (detailFound) ? detailFound.tassi : [];
    }
  }

  onValueChange(detail: CedolaDetail, newValue: string, type: 'NOMINALE' | 'EFFETTIVO') {
    if (type === 'NOMINALE') {
      this.modelChanged.next({
        currentVal: newValue,
        currentType: type,
        currentDetail : detail
      });
      // detail.valoreNominale = (newValue && newValue.length > 0) ? +newValue : null;
    } else if (type === 'EFFETTIVO') {
      this.modelChanged.next({
        currentVal: newValue,
        currentType: type,
        currentDetail: detail
      });
      // detail.valoreEffettivo = (newValue && newValue.length > 0) ? +newValue : null;
    }
  }

  updateStore(model: CedolaChangeModel) {

    if (model.currentType === 'NOMINALE') {
      model.currentDetail.valoreNominale = +model.currentVal.padEnd(this.maxLengthPad, '0');
    } else {
      model.currentDetail.valoreEffettivo = +model.currentVal.padEnd(this.maxLengthPad, '0');
    }
    this.store.editCedolaDetail(model.currentDetail);
  }

  triggerUpload(uploader) {
    const event = new MouseEvent('click', { bubbles: true });
    uploader.el.nativeElement.getElementsByTagName('input')[0].dispatchEvent(event);
  }

  onUpload(uploader, $event) {
    this.upload.emit($event);
    uploader.clear();
  }

  onPasteText($event, detailIndex: number, isValoreEffettivo: boolean) {
    $event.preventDefault();
    const text = $event.clipboardData.getData('text/plain').trim() as string;
    const stringValues = text.split('\n').map(el => el.replace('\r', '').replace(',', '.'));
    for (let i = 0; i < stringValues.length; i++) {
      if ((detailIndex + i) < this.currentCedolaDetail.length) {
        let newValue = null;
        if (stringValues[i].includes('%')) {
          const convertedValue = Number(stringValues[i].replace('%', ''));
          newValue = (!isNaN(convertedValue)) ? Number(stringValues[i].replace('%', '')) : null;
        } else {
          const convertedValue = Number(stringValues[i]);
          newValue = (!isNaN(convertedValue)) ? Number(stringValues[i]) : null;
        }
        if (newValue) {
          this.currentCedolaDetail[detailIndex + i] = {
            ...this.currentCedolaDetail[detailIndex + i],
            valoreNominale: isValoreEffettivo ? this.currentCedolaDetail[detailIndex + i].valoreNominale : newValue,
            valoreEffettivo: isValoreEffettivo ? newValue : this.currentCedolaDetail[detailIndex + i].valoreEffettivo,
          };
          // this.onValueChange(this.currentCedolaDetail[detailIndex + i],
          //   (isValoreEffettivo) ? this.currentCedolaDetail[detailIndex + i].valoreEffettivo.toString()
          //     : this.currentCedolaDetail[detailIndex + i].valoreNominale.toString(),
          //   (isValoreEffettivo) ? 'EFFETTIVO' : 'NOMINALE');
          this.updateStore({
            currentVal: (isValoreEffettivo) ?
              this.currentCedolaDetail[detailIndex + i].valoreEffettivo.toString()
              : this.currentCedolaDetail[detailIndex + i].valoreNominale.toString(),
            currentType: (isValoreEffettivo) ? 'EFFETTIVO' : 'NOMINALE',
            currentDetail : this.currentCedolaDetail[detailIndex + i]
          });
        }
      }
    }
  }

  getYesterday() {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 1);
    return dateObj;
  }

  private handleEvents() {
    this.subscriptions.push(this.simulationService.onSaveAndNext$.subscribe(this.onSave.bind(this)));
    this.subscriptions.push(this.simulationService.onSaveAndClose$.subscribe(this.onSaveAndClose.bind(this)));
  }

}
