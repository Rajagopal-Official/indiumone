import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../auth/auth.service';
import { Home } from './home.model';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NotificationsService } from '../notifications.service';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NotificationModalComponent } from '../notification-modal/notification-modal.component';
import { NewApplicationComponent } from '../new-application/new-application.component';
import { GrantAccessComponent } from '../grant-access/grant-access.component';
import { ApplicationsService } from '../applications.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    MatTooltipModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  constructor(private authService: AuthService, private dialog: MatDialog, private applicationsService: ApplicationsService) {}
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
  items = signal<Home[]>(this.applicationsService.applications());
  filteredItems = signal<Home[]>(this.items());
  slides = signal<any[]>([
    {
      title: 'An AI-Driven Digital Engineering Company',
      stream: 'Engineering +AI',
      desc: 'Indium is a fast-growing, AI-driven digital engineering services company, developing cutting-edge solutions across applications and data.',
      img: '../../assets/AI.jpg',
    },
    {
      title: 'Apps of our Organization',
      stream: 'Can utilize all the apps at one place',
      desc: 'One stop place to leverage all the technical essentials ,which is made for us and made by us',
      img: '../../assets/slide2.jpg',
    },
    {
      title: 'Engineering Solutions Hub',
      stream: 'Accelerate your projects with our in-house tools',
      desc: 'Access all the powerful engineering solutions and platforms developed by our teams to enhance productivity.',
      img: '../../assets/Engineering.jpg',
    },
    {
      title: 'AI-Driven Innovation Center',
      stream: 'Unlock AI tools and platforms',
      desc: 'Explore a collection of AI-powered apps and services designed to drive innovation across projects and processes.',
      img: '../../assets/AWS.jpg',
    },
  ]);

  searchApps() {
    const searchTerm = this.searchTerm().toLowerCase();
    this.filteredItems.set(
      this.items().filter((item) =>
        item.title.toLowerCase().includes(searchTerm)
      )
    );
  }

  showNotificationDrawer: boolean = this.notificationsService.isSidebarOpen;
  get isSidebarOpen(): boolean {
    return this.notificationsService.isSidebarOpen;
  }

  get notifications(): string[] {
    return this.notificationsService.notifications();
  }

  toggleModal(): void {
    this.dialog.open(NotificationModalComponent, {
      width: '650px',
      panelClass: 'blurred-backdrop',
      backdropClass: 'blurred-backdrop',
    });
  }

  toggleApplicationModal(): void {
    this.dialog.open(NewApplicationComponent, {
      width: '650px',
      panelClass: 'blurred-backdrop',
      backdropClass: 'blurred-backdrop',
    });
  }

  toggleAccessModal(): void {
    this.dialog.open(GrantAccessComponent, {
      width: '650px',
      panelClass: 'blurred-backdrop',
      backdropClass: 'blurred-backdrop',
    });
  }
}
