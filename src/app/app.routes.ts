import { Routes } from '@angular/router';
import { HelloComponent } from './hello/hello.component';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full' }, // Default route
    { path: 'auth', component: AuthComponent },
    { path: 'hello', component: HelloComponent, pathMatch: 'full' },
    { path: '**', redirectTo: '/auth' } // Redirect to auth for unknown routes
];