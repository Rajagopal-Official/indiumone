import { Injectable, signal, WritableSignal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authToken: string | null = null;
  private timeoutId: any;
  private sessionDuration = 60 * 60 * 1000;
  private usernameSignal: WritableSignal<string | undefined> = signal<
    string | undefined
  >(undefined);

  constructor(
    private authService: MsalService,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient
  ) {}
  getUsernameSignal() {
    return this.usernameSignal;
  }

  setUsername(username: string | undefined) {
    this.usernameSignal.set(username);
  }
  login() {
    const sourceUrl = 'http://localhost:4200/get-token';
    const ssoUrl = `https://indiumssoauth.azurewebsites.net/login?sourceurl=${encodeURIComponent(
      sourceUrl
    )}`;
    console.log('Redirecting to:', ssoUrl);
    window.location.href = ssoUrl;
  }
  

  getToken(): string | null {
    if (!this.authToken) {
      this.authToken = localStorage.getItem('authToken');
    }
    return this.authToken;
  }

  getAuthorizedApps() {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient.get(
      'https://indiumssoauth.azurewebsites.net/get_authorized_apps',
      { headers }
    );
  }

  logout() {
    // this.authService.logout().subscribe(() => {
    //   this.clearSessionTimer();
    //   localStorage.clear();
    //   sessionStorage.clear();
    //   Swal.fire({
    //     icon: 'success',
    //     title: 'Logged out successfully',
    //     showConfirmButton: false,
    //     timer: 1500,
    //   });
    //   this.router.navigate(['/']);
    // });
    localStorage.clear()
    Swal.fire({
          icon: 'success',
          title: 'Logged out successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/']);
  }

  startSessionTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.logout();
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
