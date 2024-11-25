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
    const role = urlParams.get('admin_user')!;
    localStorage.setItem('Admin Access', role);

    if (token) {
      localStorage.setItem('authToken', token); 
      localStorage.setItem('loginTimestamp', Date.now().toString()); 
      this.router.navigate(['/get-token'], { queryParams: { token } });
    }

    const storedToken = localStorage.getItem('authToken');
    const loginTimestamp = parseInt(localStorage.getItem('loginTimestamp') || '0', 10);

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
  }

  private autoLogin(token: string) {
    this.isLoggedIn = true;
    this.username = localStorage.getItem('username')!;
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
    localStorage.setItem('username', username);
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
}
