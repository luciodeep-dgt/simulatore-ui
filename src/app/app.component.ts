import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { isEmpty, includes, values } from 'ramda';
import { AuthService } from './auth/auth.service';
import { Role, roles } from './auth/user';
import { LocaleService } from './core/locale.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'simulatore-ui';

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  isLoggedIn$: Observable<boolean>;

  constructor(
    private readonly localeService: LocaleService,
    private readonly authService: AuthService,
    private readonly roleService: NgxRolesService,
    private readonly permissionsService: NgxPermissionsService
  ) {
    this.localeService.init();
    this.isLoggedIn$ = this.authService.isAuthenticated();
  }
  ngOnInit() {
    this.authService.currentUser$
    .pipe(
      tap((user: any) =>
        this.setupRoleWithPermissions((user || {}).groupNames)
      ),
      takeUntil(this.destroy$)
    )
    .subscribe();
  }

  private setupRoleWithPermissions(groups: any[]) {
    let role: Role = null;
    if (!groups || isEmpty(groups)) {
      return;
    }
    this.permissionsService.flushPermissions();
    this.roleService.flushRoles();
    values(environment.ROLE).forEach((ruolo, i) => {
      if (includes(ruolo, groups)) {
        role = roles[i];
        const permissions = (role.functions || []).map((f) => f.id);
        this.roleService.addRole(role.id, permissions);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
