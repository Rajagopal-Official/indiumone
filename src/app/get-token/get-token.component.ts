import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthComponent } from '../auth/auth.component';
import { HomeComponent } from '../home/home.component';
@Component({
  selector: 'app-get-token',
  standalone: true,
  imports: [HomeComponent],
  templateUrl: './get-token.component.html',
  styleUrl: './get-token.component.css',
})
export class GetTokenComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.storeTokenInLocalStorage(token);
      }
      const role = params['admin_user'];
      if (role) {
        localStorage.setItem('Role', role);
      }
    });
  }

  private storeTokenInLocalStorage(token: string): void {
    localStorage.setItem('token', token);
    console.log('Token stored in local storage:', token);
  }
}
