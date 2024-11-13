import { GetTokenComponent } from './get-token/get-token.component';
import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MsalGuard } from '@azure/msal-angular';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { GrantAccessComponent } from './grant-access/grant-access.component';
import { NewApplicationComponent } from './new-application/new-application.component';
import { AddApplicationComponent } from './add-application/add-application.component';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { EditPageComponent } from './edit-page/edit-page.component';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'home', component: HomeComponent,canActivate:[authGuard] },
  {
    path: 'grant-access',
    component: GrantAccessComponent,
  },
  {
    path: 'get-token',
    component: GetTokenComponent,
  },
  {
    path: 'add-application',
    component: AddApplicationComponent,
  },
  {
    path: 'applications',
    component: EditApplicationComponent,
  },
  {
    path: 'edit-app/:id',
    component: EditPageComponent,
  },
  {
    path: 'view-application/:id',
    component: EditPageComponent,
  },
  { path: '**', redirectTo: '' },
 
];
