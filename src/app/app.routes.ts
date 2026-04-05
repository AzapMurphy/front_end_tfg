import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BuscadorComponent } from './components/buscador/buscador.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'buscador', component: BuscadorComponent },
  { path: '**', redirectTo: 'login' }
];