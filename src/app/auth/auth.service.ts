import { Injectable, signal, WritableSignal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Router } from '@angular/router';
import { loginRequest } from './auth-config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private timeoutId: any;
  private sessionDuration = 0.2 * 60 * 1000; // 20 seconds
  private usernameSignal: WritableSignal<string | undefined> = signal<string | undefined>(undefined);

  constructor(
    private authService: MsalService,
    private router: Router
  ) {}

  getUsernameSignal() {
    return this.usernameSignal;
  }

  setUsername(username: string | undefined) {
    this.usernameSignal.set(username);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.setUsername(undefined);
      this.clearSessionTimer();
      localStorage.clear();
      sessionStorage.clear(); // Clear session storage
      Swal.fire({
        icon: 'success',
        title: 'Logged out successfully',
        showConfirmButton: false,
        timer: 1500
      });
      this.router.navigate(['/login']); // Redirect to login page after logout
    });
  }

  login() {
    this.authService.loginRedirect(loginRequest).subscribe(() => {
      const account = this.authService.instance.getActiveAccount();
      if (account) {
        this.setUsername(account.username);
        Swal.fire({
          icon: 'success',
          title: 'Logged in successfully',
          showConfirmButton: false,
          timer: 1500
        });
        this.startSessionTimer();
      }
    });
  }

  startSessionTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.logout(); // Logout and redirect to login page after session expires
    }, this.sessionDuration);
  }

  clearSessionTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  resetSessionTimer() {
    this.startSessionTimer();
  }
}
