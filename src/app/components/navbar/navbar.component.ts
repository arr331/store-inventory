import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(public auth: Auth, public authService: AuthService, private router: Router) {}

  user() {
    return this.authService.getUser();
  }

  isAdmin() {
    const role = this.authService.getRole();
    return role === 'admin';
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
