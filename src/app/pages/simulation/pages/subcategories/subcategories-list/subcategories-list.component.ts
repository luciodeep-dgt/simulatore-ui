import { Component, OnInit, EventEmitter, Output, Input, ViewChild, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Table, LazyLoadEvent } from 'primeng';
import { NotificationService } from './../../../../../core/notification.service';
import { Subcategory, Pageable, MAX_SUBCATEGORIES } from './../../../../../shared/models';


@Component({
  selector: 'app-subcategories-list',
  templateUrl: './subcategories-list.component.html',
  styleUrls: ['./subcategories-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubcategoriesListComponent implements OnInit, OnChanges {

  @ViewChild('table', { static: false }) table: Table;
  @Input() subcategories: Pageable<Subcategory>;
  @Input() disabled = false;
  @Input() selectedCategories: Subcategory[];
  @Input() rowsForPage = 10;
  @Output() pageChange = new EventEmitter<LazyLoadEvent>();
  @Output() selectSubcategory = new EventEmitter<{subcategory: Subcategory, checked: boolean}>();
  cols: any[];

  constructor(
    private readonly notification: NotificationService,
  ) {
    this.cols = [
      { field: 'descrizione', header: 'Sottocategorie' }
    ];
  }

  ngOnInit() { }

  ngOnChanges() {
    this.subcategories.items = this.subcategories.items.map(subcategory => ({
      ...subcategory,
      checked: this.isChecked(subcategory)
    }));
  }

  paginate($event) {
    this.pageChange.emit($event);
  }

  onSelectSubcategory(subcategory: Subcategory, checked: boolean) {
    if (this.selectedCategories.length === MAX_SUBCATEGORIES && checked) {
      this.notification.warning('Non puoi selezionare più di ' + MAX_SUBCATEGORIES + ' sottocategorie.');
    } else {
      this.selectSubcategory.emit({subcategory, checked});
    }
  }

  isDisabled(subcategory: Subcategory) {
    return (this.selectedCategories.length === MAX_SUBCATEGORIES && !(subcategory as any).checked) || this.disabled;
  }

  isChecked(subcategory: Subcategory) {
    return (this.selectedCategories) ? !!this.selectedCategories.find(subcat => subcat.id === subcategory.id) : false;
  }

}
