import { Routes } from '@angular/router';
import { HelloComponent } from './hello/hello.component';
import { AuthComponent } from './auth/auth.component';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'hello', component: HelloComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
