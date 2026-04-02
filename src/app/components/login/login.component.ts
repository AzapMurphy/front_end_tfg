import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ¡IMPORTANTE para el [(ngModel)]!
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,       // Esto permite que el HTML entienda ngModel
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  email: string = '';
  password: string = '';
  isLogin: boolean = true;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      if (this.isLogin) {
        await this.authService.login(this.email, this.password);
      } else {
        await this.authService.register(this.email, this.password);
      }
      this.router.navigate(['/buscador']);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.loading = true;
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/comparador']);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }

  private getErrorMessage(code: string): string {
    const errors: { [key: string]: string } = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'El email ya está registrado',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Email no válido',
      'auth/popup-closed-by-user': 'Popup cerrado por el usuario'
    };
    return errors[code] || 'Error desconocido';
  }
}
