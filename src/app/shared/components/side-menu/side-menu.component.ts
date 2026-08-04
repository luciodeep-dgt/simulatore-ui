import { Component } from '@angular/core';
import { MenuService, MenuItem } from '../../../core/menu.service';
import { Observable } from 'rxjs';
import { expandMenuAnimation, menuItemAnimation, fadeInOut, frecciaVerde } from 'src/app/shared/components/side-menu/side-menu.animations';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  animations: [ expandMenuAnimation, menuItemAnimation, fadeInOut, frecciaVerde ]
})
export class SideMenuComponent {

  isOpen = false;
  menuItems$: Observable<MenuItem[]>;

  constructor(private readonly menuService: MenuService) {
    this.menuItems$ = this.menuService.getItems();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  animationDone($event) {
    this.menuService.notify(this.isOpen);
  }

}

