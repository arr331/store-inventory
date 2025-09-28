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
  loading = false;
  error = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router, private auth: Auth) {}

  async onLogin() {
    this.loading = true;
    this.showPassword = false;
    try {
      const user = await this.authService.login(this.email, this.password);
      if (user) {
        this.loading = false;
        this.router.navigate(['/vender']);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.errorMessage();
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

  errorMessage() {
    this.error = true;
    setTimeout(() => {
      this.error = false;
    }, 4000); // se oculta automático en 2s
  }
}

