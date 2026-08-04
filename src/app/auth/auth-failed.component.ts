import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-failed',
  templateUrl: 'auth-failed.component.html'
})

export class AuthFailedComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit() { }

  onClickAccedi() {
    this.authService.startAuthentication();
  }

}
