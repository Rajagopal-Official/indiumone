import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HelloComponent } from './hello/hello.component';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AuthComponent, HelloComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Corrected from styleUrl to styleUrls
})
export class AppComponent implements OnInit {
  title = 'indiumOne';

  constructor(private router: Router) {} // Inject Router

  ngOnInit() {
    const token = this.getTokenFromUrl(); // Extract the token from the URL
    if (token) {
      this.storeToken(token); // Store the token in session storage
      this.redirectToHome(); // Navigate to the home page
    }
  }

  private getTokenFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
  }

  private storeToken(token: string): void {
    sessionStorage.setItem('authToken', token); // Store the token in session storage
  }

  private redirectToHome(): void {
    this.router.navigate(['/home']); // Use the Router to navigate
  }
}
