import { GetTokenComponent } from './get-token/get-token.component';
import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';
import { GrantAccessComponent } from './grant-access/grant-access.component';
import { NewApplicationComponent } from './new-application/new-application.component';
import { AddApplicationComponent } from './add-application/add-application.component';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { UiComponent } from './ui/ui.component';
import { FormComponent } from './form/form.component';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'home', component: HomeComponent},
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
    path: 'ui',
    component: UiComponent,
  },
  {
    path: 'form',
    component: FormComponent,
  },
  {
    path: 'view-application/:id',
    component: EditPageComponent,
  },
  { path: '**', redirectTo: '' },
 
];
