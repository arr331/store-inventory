import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  role:string = 'empleado'; // : 'admin' | 'employee' 

  constructor(private authService: AuthService, private router: Router, private auth: Auth) {}

  async onLogin() {
    try {
      const user = await this.authService.login(this.email, this.password);
      if (user) {
        this.router.navigate(['/vender']);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async onRegister() {
    try {
      const user = await this.authService.register(this.email, this.password, this.role);
      if (user) {
        this.router.navigate(['/vender']);
      }
    } catch (error) {
      console.error('Register error:', error);
    }
  }
}

