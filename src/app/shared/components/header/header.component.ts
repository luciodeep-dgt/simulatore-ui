import { MenuItem } from 'primeng';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { User } from './../../../auth/user';
import { AuthService } from './../../../auth/auth.service';
import { MenuService } from '../../../core/menu.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  {

  logoExpanded$: Observable<boolean>;
  profileItems: MenuItem[];
  currentUser$: Observable<User>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly menuService: MenuService) {
    this.logoExpanded$ = this.menuService.open$;
    this.currentUser$ = this.authService.currentUser$;
    this.profileItems = [
      {
        label: 'Esci',
        icon: 'pi pi-fw pi-plus',
        command: () =>  {
          this.authService.logout();
          this.router.navigate(['autenticazione']);
        }
      },
    ];
  }

}
