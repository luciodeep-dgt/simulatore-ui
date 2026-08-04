import { Component, OnInit, Input } from '@angular/core';
import * as R from 'ramda';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SimulationStore } from './../../../simulation.store';
import { Subcategory } from '../../../../../shared/models';
import { Cedola } from './../../../../../shared/models';


@Component({
  selector: 'app-cedole-list',
  templateUrl: './cedole-list.component.html',
  styleUrls: ['./cedole-list.component.scss']
})
export class CedoleListComponent implements OnInit {

  @Input() collapsed = false;
  @Input() cedole$?: Observable<Cedola[]>;
  subcategories$: Observable<Subcategory[]>;
  cedoleSubcategories$: Observable<any>;
  mappedCedole$: Observable<any>;

  constructor(
    private store: SimulationStore
  ) { }

  ngOnInit() {
    this.subcategories$ = this.store.subcategories$;
    this.cedoleSubcategories$ = this.cedole$.pipe(
      map(cedole => {
        const state = this.store.getStateSnapshot();
        return R.flatten( cedole.map(cedola => 
          cedola.prodotti.map(prodotto => ({
            ...state.subcategories.find(mainSubcat => mainSubcat.id === prodotto.id),
            descCedola: cedola.descrizione
          }))
        ));
      })
    );

    this.mappedCedole$ = this.cedole$.pipe(
      map(cedole => this.generateMappedList(cedole))
    );
  }

  private generateMappedList(cedole: Cedola[]) {
    const mappaCedole = {};
    cedole.forEach(cedola => {
      cedola.prodotti.forEach(sottocategoria => {
        sottocategoria.tassi.forEach(dettaglio => {
          const mapIndex = dettaglio.dataRiferimento.toString();
          const mappedDettaglio = {
            ...dettaglio,
            idProdotto: sottocategoria.id
          };
          if (mappaCedole[mapIndex]) {
            mappaCedole[mapIndex].push(mappedDettaglio);
          } else {
            mappaCedole[mapIndex] = [mappedDettaglio];
          }
        });
      });
    });
    return mappaCedole;
  }
}
