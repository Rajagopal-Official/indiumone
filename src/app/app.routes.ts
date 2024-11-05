import { Routes } from '@angular/router';
import { HelloComponent } from './hello/hello.component';
import { AuthComponent } from './auth/auth.component';
import { MsalGuard } from '@azure/msal-angular';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'hello', component: HelloComponent, canActivate: [authGuard] },
  {
    path: 'home',
    component: HomeComponent,
    // , canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' },
];
