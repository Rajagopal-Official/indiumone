import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  ViewChild,
  OnInit,
} from '@angular/core';
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
import {
  HttpClientModule,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';

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
    MatTooltipModule,
    HttpClientModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  notificationsService = inject(NotificationsService);
  usernameSignal = this.authService.getUsernameSignal();
  currentYear: number = new Date().getFullYear();
  authorizedApps: any[] = []; // Store authorized apps

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private applicationsService: ApplicationsService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Call the method to fetch authorized apps if the token exists
    this.fetchAuthorizedApps();
  }

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

  // Method to fetch authorized apps
  // Method to fetch authorized apps
  fetchAuthorizedApps(): void {
    const token = sessionStorage.getItem('authToken'); // Get token from session storage

    if (token) {
      const url = '/api/get_authorized_apps'; // Use the proxy endpoint
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`, // Add token to Authorization header
        'Content-Type': 'application/json',
      });

      this.http.get<any[]>(url, { headers }).subscribe(
        (response) => {
          console.log('Authorized apps response:', response);

          // Map the response to match `filteredItems` structure
          const formattedItems = response.map((item) => ({
            title: item.app_name,
            image: item.app_image_url,
            description: item.app_description,
            department: item.department_access_restriction,
            link: item.app_url,
          }));

          // Update `filteredItems` with the formatted items
          this.filteredItems.set(formattedItems);
        },
        (error) => {
          console.error('Error fetching authorized apps:', error);
        }
      );
    } else {
      console.log('No token found in session storage.');
    }
  }

  searchTerm = signal<string>('');
  items = signal<Home[]>(this.applicationsService.applications());
  filteredItems = signal<Home[]>(this.items());
  slides = signal<any[]>([
    // Your slide data...
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
