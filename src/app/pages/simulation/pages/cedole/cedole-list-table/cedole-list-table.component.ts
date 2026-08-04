import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import * as R from 'ramda';
import { Subcategory, Cedola, TaxType } from '../../../../../shared/models';
import { ThoDigitPipe } from 'src/app/shared/pipes/two-digit-paddings.pipe';


@Component({
  selector: 'app-cedole-list-table',
  templateUrl: './cedole-list-table.component.html',
  styleUrls: ['./cedole-list-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CedoleListTableComponent implements OnInit {

  @Input() cedole?: Cedola[];
  @Input() subcategories: Subcategory[];
  @Input() mappedCedole: any;
  @Input() cedoleSubcategories: any[];
  taxTypology: TaxType;

  constructor(private thoDigitPipe: ThoDigitPipe) { }

  ngOnInit() {

  }

  getSubcategoryValue(detailKey, subcategory, indexRow: number, indexCol: number) {
    if (!subcategory) { return ''; }
    const valuesSubcategory = this.mappedCedole[detailKey].filter(detailCedola => detailCedola.idProdotto === subcategory.id);
    const manyCedoleAdmitted = this.subcategories.length === 1;
    let valueSubcategory;
    if (!manyCedoleAdmitted) {
      valueSubcategory = valuesSubcategory[0];
    } else {
      valueSubcategory = valuesSubcategory[indexCol];
    }
    if (valueSubcategory &&
      !R.isNil(valueSubcategory.valoreEffettivo) &&
      !(valueSubcategory.valoreEffettivo === '.')) {
      return  this.thoDigitPipe.transform(valueSubcategory.valoreEffettivo) + '%';
    }
    return '';
  }

  getToday() {
    return new Date();
  }

  getMappedCedoleKeys() {
    const keys = (this.mappedCedole) ? Object.keys(this.mappedCedole) : null;
    return (keys && keys.length > 0) ? R.sortBy(k => new Date(k), keys) : [];
  }
}
