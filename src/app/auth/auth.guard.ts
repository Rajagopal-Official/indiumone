import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(MsalService);
  const router = inject(Router);

  const accounts = authService.instance.getAllAccounts();
  if (accounts.length > 0) {
    return true;  
  } else {
    router.navigate(['/']);
    return false;  
  }
};