// auth.component.ts
import { MatToolbarModule } from '@angular/material/toolbar';
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { Router, RouterOutlet } from '@angular/router';
import { loginRequest } from './auth-config';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

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
    console.log(urlParams, 'URL');
    const token = urlParams.get('token');
    const role = urlParams.get('admin_user')!; 
    localStorage.setItem('Admin Access', role);
    console.log(role, 'Role');
    

    if (token) {
      this.router.navigate(['/get-token'], { queryParams: { token } });
    }

    const accounts = this.authService.instance.getAllAccounts();
    if (accounts.length > 0) {
      this.isLoggedIn = true;
      this.username = accounts[0].username;
      console.log(this.username,'uss')
      this.AuthService.setUsername(this.username);
      Swal.fire({
        icon: 'success',
        title: 'Logged in successfully',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        this.router.navigate(['/home']);
      });
      this.AuthService.startSessionTimer();
    } else {
      this.authService.handleRedirectObservable().subscribe({
        next: (result) => {
          if (result) {
            this.isLoggedIn = true;
            this.username = result.account.username;
            this.AuthService.setUsername(this.username);
            Swal.fire({
              icon: 'success',
              title: 'Logged in successfully, Explore the Applications...',
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              this.router.navigate(['/home']);
            });
            this.AuthService.startSessionTimer(); // Start session timer after login
          }
        },
        error: (error) => console.error(error),
      });
    }
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
