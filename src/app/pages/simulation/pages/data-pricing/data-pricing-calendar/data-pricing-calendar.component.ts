import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Constants } from '../../../../../shared/models';
import * as Holidays from 'date-holidays';
import * as moment from 'moment';
import * as R from 'ramda';

@Component({
  selector: 'app-data-pricing-calendar',
  templateUrl: './data-pricing-calendar.component.html',
  styleUrls: ['./data-pricing-calendar.component.scss']
})
export class DataPricingCalendarComponent implements OnInit, OnChanges {

  @Input() disabled = false;
  @Input() selectedDates: Date[];
  @Output() selectDate = new EventEmitter<any>();
  @Output() unselectDate = new EventEmitter<any>();
  maxSelectableDates = Constants.MAX_DATA_PRICING;
  invalidDates: Date[];
  maxDate: Date;
  calendarLocaleIt: any;

  private holidays: any;
  private oldSelectedDates: Date[] = [];

  constructor() {
    this.calendarLocaleIt = {
      firstDayOfWeek: 1,
      dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
      dayNamesMin: ['D', 'L', 'M', 'M', 'G', 'V', 'S'],
      monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre',
        'Ottobre', 'Novembre', 'Dicembre'],
      monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      today: 'Oggi',
      clear: 'Cancella'
    };
    this.maxDate = this.getMaxDate();
    this.holidays = new Holidays('IT');
    this.invalidDates = this.holidays.getHolidays(new Date().getFullYear().toString()).map(holiday => new Date(holiday.date));
  }

  ngOnInit() {
    this.selectedDates = (this.selectedDates && this.selectedDates.length > 0) ? this.selectedDates : undefined;
    this.oldSelectedDates = this.selectedDates || [];
  }

  ngOnChanges() {
    if (this.selectedDates && this.selectedDates.length > 0) {
      const formattedDates = this.selectedDates
        .map(date => new Date(date.getFullYear(), date.getMonth(), date.getDate()));
      this.selectedDates = R.uniq(formattedDates);
    } else {
      this.selectedDates = undefined;
    }
    this.oldSelectedDates = this.selectedDates || [];
  }

  onMonthChange($event) {
    this.invalidDates = this.holidays.getHolidays($event.year).map(holiday => new Date(holiday.date));
  }

  onSelectDate($event: Date[]) {
    if ($event === null && this.oldSelectedDates.length === 1) {
      this.unselectDate.emit(this.oldSelectedDates[0]);
      this.oldSelectedDates = [];
    } else {
      const deletedDate = this.oldSelectedDates
        .find(el => !$event.find(oldDate => oldDate.toLocaleDateString() === el.toLocaleDateString()));
      if (!deletedDate) {
        const addedDate = $event && $event.find(el =>
          !this.oldSelectedDates.find(oldDate => oldDate.toLocaleDateString() === el.toLocaleDateString()));
        if (addedDate) {
          this.selectDate.next(addedDate);
        }
      } else {
        this.unselectDate.next(deletedDate);
      }
      this.oldSelectedDates = $event;
    }
  }

  getMaxDate() {
    // const dateObj = new Date();
    // dateObj.setDate(dateObj.getDate() - 1);
    return new Date();
  }

}
