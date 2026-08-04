import { SimulationStore } from './../../../simulation.store';
import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng';
import * as moment from 'moment';
import { v1 as uuidv1 } from 'uuid';

import { Curve } from './../../../../../shared/models';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './curve-edit-dialog.component.html',
  styleUrls: ['./curve-edit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CurveEditDialogComponent implements OnInit {

  form: FormGroup;
  isFormSubmitted = false;

  isInEdit: boolean;
  isChoosing: boolean;
  isInCreate = false;
  selectedCurve?: Curve;
  option: 'DUPLICATE' | 'CREATE';
  settingsMask: any;

  private defaultCurve: Curve;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly store: SimulationStore,
    private el: ElementRef,
    private fb: FormBuilder
  ) {
    this.isInEdit = this.config.data.isInEdit;
    this.isChoosing = this.config.data.isChoosing;
    this.selectedCurve = this.config.data.selectedCurve;

    this.buildFormGroup();
  }

  ngOnInit() {
    this.settingsMask = {
      mask: '[s]0.0000000000000000000000',
      definitions: {
        's': /-/
      },
      scale: 20,
      signed: true,
      max: 9,
      padFractionalZeros: true,
      min: -9,
      normalizeZeros: true
    };
    if (!this.selectedCurve.flagCustom) {
      this.defaultCurve = { ...this.selectedCurve };
    }
  }


  onModalClose() {
    this.ref.close(null);
  }

  onConfirm() {
    if (this.option === 'DUPLICATE') {
      this.selectedCurve = {
        ...this.selectedCurve,
        flagCustom: true,
        id: uuidv1() as any, // Serve al FE per identificare la curva duplicata quando l'user vorrà fare l'eliminazione
        colore: undefined
      };
      this.ref.close(this.selectedCurve);
    } else if (this.option === 'CREATE') {
      this.isInEdit = false;
      this.isChoosing = false;
      this.isInCreate = true;
      this.option = null;
    } else {
      this.isFormSubmitted = true;
      if (this.form.invalid) {
        return;
      }
      const values = this.form.controls;
      const createdCurve = { ...this.selectedCurve };
      createdCurve.colore = this.isInCreate ? undefined : createdCurve.colore;
      createdCurve.descrizione = values.descrizione.value;
      createdCurve.id = (this.isInCreate) ? uuidv1() as any : this.selectedCurve.id;
      createdCurve.dettagli = this.selectedCurve.dettagli
        .map((dettaglio, index) =>
          ({
            dataRiferimento: moment(values['date' + index].value).format().split('T')[0] as any,
            tenor: dettaglio.tenor,
            valore: values['value' + index].value,
            valoreOriginale: (this.isInCreate) ?
              values['value' + index].value : (dettaglio.valoreOriginale || values['value' + index].value)
          })
        );
      if (!createdCurve.flagCustom) {
        const curveToCompare = this.defaultCurve.dettagli
          .map(dettaglio =>
            ({
              dataRiferimento: dettaglio.dataRiferimento,
              tenor: dettaglio.tenor,
              valore: dettaglio.valore,
              valoreOriginale: (this.isInCreate) ? dettaglio.valore : dettaglio.valoreOriginale
            }));
        createdCurve.flagCustom = (this.isInCreate) ? true : JSON.stringify(curveToCompare) !== JSON.stringify(createdCurve.dettagli);
      }
      this.ref.close(createdCurve);
    }
  }

  getSubcategoryDescription() {
    const subcategories = this.store.getStateSnapshot().subcategories;
    return subcategories.find(el => el.id === this.selectedCurve.idSottocategoria).descrizione;
  }

  getYesterday() {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 1);
    return dateObj;
  }

  getControl(controlName: string) {
    return this.form.get(controlName);
  }

  hasErrorsToShow(controlName: string) {
    return (this.getControl(controlName).dirty || this.getControl(controlName).touched || this.isFormSubmitted)
      && this.getControl(controlName).invalid;
  }

  onPasteText($event, detailIndex: number) {
    $event.preventDefault();
    const text = $event.clipboardData.getData('text/plain').trim() as string;
    const stringValues = text.split('\n').map(el => el.replace('\r', '').replace(',', '.'));
    for (let i = 0; i < stringValues.length; i++) {
      if ((detailIndex + i) < this.selectedCurve.dettagli.length) {
        let newValue = null;
        if (stringValues[i].includes('%')) {
          const convertedValue = Number(stringValues[i].replace('%', ''));
          newValue = (!isNaN(convertedValue)) ? Number(stringValues[i].replace('%', '')) : null;
        } else {
          const convertedValue = Number(stringValues[i]);
          newValue = (!isNaN(convertedValue)) ? Number(stringValues[i]) : null;
        }
        if (newValue !== null && newValue !== undefined ) {
          this.getControl('value' + (detailIndex + i)).setValue('' + newValue);
        }
      }
    }
  }

  private buildFormGroup() {
    const editingCurve = (this.isInEdit) ? this.selectedCurve : null;
    this.form = this.fb.group({
      descrizione: new FormControl((editingCurve) ? editingCurve.descrizione : '', [Validators.required, Validators.maxLength(40)])
    });

    this.selectedCurve.dettagli.forEach((dettaglio, index) => {
      this.form
        .addControl('date' + index,
          this.fb.control({ value: new Date(dettaglio.dataRiferimento), disabled: true }, [Validators.required])
        );
      this.form
        .addControl('value' + index, this.fb.control((this.isInEdit) ? dettaglio.valore : null,
          [Validators.required])
        );
    });

  }
}
