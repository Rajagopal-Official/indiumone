import { Routes } from '@angular/router';
import { HelloComponent } from './hello/hello.component';
import { AuthComponent } from './auth/auth.component';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
    {path:'',component:AuthComponent},
    { path: 'hello', component: HelloComponent },
    {path:'**',redirectTo:''}
];
