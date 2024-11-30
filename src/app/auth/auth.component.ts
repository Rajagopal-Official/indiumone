import { MatToolbarModule } from '@angular/material/toolbar';
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { Router, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoggedIn = false;
  username: string | undefined;
  currentYear: number = new Date().getFullYear();

  constructor(
    private authService: MsalService,
    private router: Router,
    private AuthService: AuthService
  ) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const username = urlParams.get('username')!;
    localStorage.setItem('username', username);
    this.AuthService.setUsername(username);

    if (token) {
      sessionStorage.setItem('authToken', token); 
      sessionStorage.setItem('loginTimestamp', Date.now().toString()); 
      this.router.navigate(['/get-token'], { queryParams: { token } });
    }

    const storedToken = sessionStorage.getItem('authToken');
    const loginTimestamp = parseInt(sessionStorage.getItem('loginTimestamp') || '0', 10);

    if (storedToken && Date.now() - loginTimestamp < this.AuthService.getSessionDuration()) {
      this.autoLogin(storedToken);
    } else {
      const accounts = this.authService.instance.getAllAccounts();
      if (accounts.length > 0) {
        this.processLogin(accounts[0].username);
      } else {
        this.authService.handleRedirectObservable().subscribe({
          next: (result) => {
            if (result) {
              this.processLogin(result.account.username);
            }
          },
          error: (error) => console.error(error),
        });
      }
    }

    // Listen for logout event
    window.addEventListener('storage', (event) => {
      if (event.key === 'logout') {
        this.handleLogoutEvent();
      }
    });
  }

  private autoLogin(token: string) {
    this.isLoggedIn = true;
    this.username = sessionStorage.getItem('username')!;
    Swal.fire({
      icon: 'success',
      title: 'Logged in successfully',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      this.router.navigate(['/home']);
    });
    this.AuthService.startSessionTimer();
  }

  private processLogin(username: string) {
    this.isLoggedIn = true;
    this.username = username;
    sessionStorage.setItem('username', username);
    Swal.fire({
      icon: 'success',
      title: 'Logged in successfully, Explore the Applications...',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      this.router.navigate(['/home']);
    });
    this.AuthService.startSessionTimer();
  }

  login() {
    this.AuthService.login();
  }

  logout() {
    this.AuthService.logout();
  }

  @HostListener('window:mousemove')
  @HostListener('window:keypress')
  resetSessionTimer() {
    this.AuthService.resetSessionTimer();
  }

  private handleLogoutEvent() {
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.username = undefined;
    this.router.navigate(['/']);
  }
}