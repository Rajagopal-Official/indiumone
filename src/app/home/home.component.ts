import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
  ViewChild,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../auth/auth.service';
import { Home } from './home.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NotificationsService } from '../notifications.service';
import { MatListModule } from '@angular/material/list';
import { RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NotificationModalComponent } from '../notification-modal/notification-modal.component';
import { ApplicationsService } from '../applications.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips'; 
import { MatChipListbox, MatChipOption } from '@angular/material/chips';

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
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatChipsModule, 
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private applicationsService: ApplicationsService,
    private router: Router
  ) {}
  notificationsService = inject(NotificationsService);
  usernameSignal = this.authService.getUsernameSignal();
  currentYear: number = new Date().getFullYear();

  form = new FormGroup({
    configurations: new FormControl(''),
  });
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
  isLoading = signal<boolean>(true);
  searchTerm = signal<string>('');
  items = signal<Home[]>([]);
  filteredItems = signal<Home[]>([]);
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
  ngOnInit() {
    this.isLoading.set(true);
    this.applicationsService.fetchApplications().subscribe({
      complete: () => {
        this.items.set(this.applicationsService.applications());
        console.log('Items:', this.items());
        this.filteredItems.set(this.items());
        console.log('Filtered Items:', this.filteredItems());
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching applications:', error);
      },
    });
  }

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
      backdropClass: 'blurred-backdrop',
      autoFocus: false,
    });
  }

  toggleApplicationModal(): void {
    this.router.navigate(['/add-application']);
  }

  toggleAccessModal(): void {
    this.router.navigate(['/grant-access']);
  }
  editApplication(): void {
    this.router.navigate(['/applications']);
  }

  categories = ['Admin', 'HR', 'Finance', 'IT', 'Marketing', 'Data & AI', 'Application Engineering', 'Digital Assurance'];
  selectedCategories: string[] = [];
  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.filterItems();
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  removeCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    }
    this.filterItems();
  }
  filterItems(): void {
    // Implement your filtering logic here based on selectedCategories
    // For example, you can filter `filteredItems` based on the selected categories
  }
}