import { MatButton, MatButtonModule } from '@angular/material/button';
import { AuthService } from './../auth/auth.service';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Home } from '../home/home.model';
import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule,MatTabsModule],
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HelloComponent  {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  constructor(private authService: AuthService) {}

  notificationsService = inject(NotificationsService);
  usernameSignal = this.authService.getUsernameSignal();
  currentYear: number = new Date().getFullYear();

  getDisplayName(): string {
    const username = this.usernameSignal();
    if (username) {
      const namePart = username.split('@')[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return 'User';
  }

  logout(): void {
    this.authService.logout();
  }

  searchTerm = signal<string>('');
  items = signal<Home[]>([
    // Your items array...
  ]);
  
  filteredItems = signal<Home[]>(this.items());
  
  slides = signal<any[]>([
    // Your slides array...
  ]);

  searchApps() {
    const searchTerm = this.searchTerm().toLowerCase();
    this.filteredItems.set(
      this.items().filter((item) =>
        item.title.toLowerCase().includes(searchTerm)
      )
    );
  }

  toggleSidebar(): void {
    this.sidenav.toggle(); // Toggle the sidebar on button click
  }

  get notifications(): string[] {
    return this.notificationsService.notifications();
  }

  hello(): string {
    return 'Hi Rajagopal';
  }
}