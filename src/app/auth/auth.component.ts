import { MatToolbarModule } from '@angular/material/toolbar';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { Router, RouterOutlet } from '@angular/router';
import { loginRequest } from './auth-config';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule,MatToolbarModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoggedIn = false;
  username: string | undefined;
  currentYear: number = new Date().getFullYear();

  constructor(private authService: MsalService, private router: Router) {}

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result) {
          this.isLoggedIn = true;
          this.username = result.account.name;
          this.router.navigate(['/hello']); // Navigate on successful login
        }
      },
      error: (error) => console.error(error),
    });
  }

  login() {
    this.authService.loginRedirect(loginRequest); // Redirects to MSAL login
  }

  logout() {
    this.authService.logout();
  }
}
