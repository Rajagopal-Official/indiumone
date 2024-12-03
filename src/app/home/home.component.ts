import { Component, HostListener, signal, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';
import { AuthService } from '../auth/auth.service';
import { ApplicationsService } from '../applications.service';
import { Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Home } from './home.model';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Notification, NotificationService } from '../notifications.service';

interface TreeNode {
  name: string; // parent node
  icon?: string; // Icon as optional prop
  children?: TreeNode[]; // children is sub nodes that is submenu like things
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    MatBadgeModule,
    MatTreeModule,
    MatProgressSpinnerModule,
    CommonModule,
    NavbarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  treeControl = new NestedTreeControl<TreeNode>((node) => node.children); // Nested tree control is responsible for managing hierarchial structure
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  selectedDepartment = signal<string>('All');
  isMobile = signal<boolean>(window.innerWidth <= 768);
  sidenavOpen = signal<boolean>(!this.isMobile());
  notifications = signal<Notification[]>([]);
  unreadCount = signal<number>(0);
  username=localStorage.getItem('username') 
  useremail=localStorage.getItem('useremail')
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile.set(window.innerWidth <= 768);
    if (this.isMobile()) {
      this.sidenavOpen.set(false);
    } else {
      this.sidenavOpen.set(true);
    }
  }
  

  constructor(
    private authService: AuthService,
    private applicationsService: ApplicationsService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.dataSource.data = [
      {
        name: 'Admin',
        icon: 'admin_panel_settings',
        children: [
          { name: 'User Management', icon: 'manage_accounts' },
          { name: 'System Settings', icon: 'settings' },
        ],
      },
      {
        name: 'HR',
        icon: 'people',
        children: [
          { name: 'Employee Portal', icon: 'person' },
          { name: 'Recruitment', icon: 'person_add' },
        ],
      },
      {
        name: 'Finance',
        icon: 'attach_money',
        children: [
          { name: 'Accounting', icon: 'account_balance' },
          { name: 'Payroll', icon: 'payments' },
        ],
      },
      {
        name: 'IT',
        icon: 'computer',
        children: [
          { name: 'Help Desk', icon: 'help' },
          { name: 'Infrastructure', icon: 'dns' },
        ],
      },
      {
        name: 'Marketing',
        icon: 'campaign',
        children: [
          { name: 'Campaigns', icon: 'trending_up' },
          { name: 'Analytics', icon: 'analytics' },
        ],
      },
      {
        name: 'Data & AI',
        icon: 'psychology',
        children: [
          { name: 'ML Models', icon: 'model_training' },
          { name: 'Data Analytics', icon: 'data_usage' },
        ],
      },
      {
        name: 'App Engineering',
        icon: 'engineering',
        children: [
          { name: 'Development', icon: 'code' },
          { name: 'DevOps', icon: 'build' },
        ],
      },
      {
        name: 'App Configuration',
        icon: 'settings',
        children: [{ name: 'Applications', icon: 'apps' }],
      },
    ];
  }
  allDepartment = { name: 'All', icon: 'category' };

  hasChild = (_: number, node: TreeNode) =>
    !!node.children && node.children.length > 0;
  // Checks if a node has children by verifying if children is defined and has a length greater than 0.
  // This logic is used in the template to show expand/collapse options only for nodes with children.
  isLoading = signal<boolean>(true);
  searchTerm = signal<string>('');
  items = signal<Home[]>([]);
  filteredItems = signal<Home[]>([]);
  showSearchField = signal<boolean>(false);
  ratings = signal<{ [key: string]: number }>({});
  usernameSignal = this.authService.getUsernameSignal();
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  getDisplayName(): string {
    const username = this.usernameSignal();
    console.log(username, 'user');
    if (username) {
      const namePart = username.split('.')[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return 'User';
  }

  searchApps() {
    const searchTerm = this.searchTerm().toLowerCase();
    this.filterApps(this.selectedDepartment(), searchTerm);
  }
  closeMenu() {
    this.menuTrigger.closeMenu();
  }
  formatUsername(username: string | null): string {
    if (!username) return '';
    const firstPart = username.split('.')[0];
    return firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
  }

  filterApps(department: string, searchTerm: string = '') {
    const filtered = this.items().filter((item) => {
      const matchesDepartment =
        department === 'All' || item.department === department;
      const matchesSearch = searchTerm
        ? item.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const isAppConfiguration = item.department === 'App Configuration';
      return !isAppConfiguration && matchesDepartment && matchesSearch;
    });
    this.filteredItems.set(filtered);
  }
  toggleSidenav() {
    this.sidenavOpen.update((value) => !value);
  }

  selectDepartment(department: string) {
    this.selectedDepartment.set(department);
    if (department !== 'App Configuration') {
      this.filterApps(department, this.searchTerm());
    } else {
      this.filteredItems.set(
        this.items().filter((item) => item.department === 'App Configuration')
      );
    }
  }

  ngOnInit() {
    this.isLoading.set(true);
    this.loadNotifications()
    this.applicationsService.fetchApplications().subscribe({
      complete: () => {
        this.items.set(this.applicationsService.applications());
        this.filterApps('All');//Initially to display the all apps based
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching applications:', error);
      },
    });
  }
  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.updateUnreadCount();
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  updateUnreadCount() {
    const unreadNotifications = this.notifications().filter(n => n.read_status === 0);
    this.unreadCount.set(unreadNotifications.length);
  }

  markAsRead(notification: Notification) {
    if (notification.read_status === 0) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          const updatedNotifications = this.notifications().map(n => 
            n.id === notification.id ? { ...n, read_status: 1 } : n
          );
          this.notifications.set(updatedNotifications);
          this.updateUnreadCount();
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  markAllAsRead() {
    const unreadIds = this.notifications()
      .filter(n => n.read_status === 0)
      .map(n => n.id);

    if (unreadIds.length > 0) {
      this.notificationService.markAllAsRead(unreadIds).subscribe({
        next: () => {
          const updatedNotifications = this.notifications().map(n => ({ ...n, read_status: 1 }));
          this.notifications.set(updatedNotifications);
          this.updateUnreadCount();
        },
        error: (error) => {
          console.error('Error marking all notifications as read:', error);
        }
      });
    }
  }

  calculateTimeAgo(timestamp: string): string {
    const now = new Date().toISOString(); 
    const updateTime = new Date(timestamp);
    const diffInSeconds = Math.floor((new Date(now).getTime() - updateTime.getTime()) / 1000);
    

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }

  openAppUrl(url: string) {
    window.open(url, '_blank');
  }


  toggleSearchField() {
    this.showSearchField.set(true);
  }

  // notifications = [
  //   {
  //     id: 1,
  //     text: 'New project invitation received',
  //     time: '5 mins ago',
  //     icon: 'folder_shared',
  //     iconClass: 'icon-info',
  //     unread: true,
  //   },
  //   {
  //     id: 2,
  //     text: 'Successfully deployed project',
  //     time: '2 hours ago',
  //     icon: 'check_circle',
  //     iconClass: 'icon-success',
  //     unread: true,
  //   },
  //   {
  //     id: 3,
  //     text: 'Server warning: High CPU usage',
  //     time: '1 day ago',
  //     icon: 'warning',
  //     iconClass: 'icon-warning',
  //     unread: false,
  //   },
  //   {
  //     id: 4,
  //     text: 'New software update available',
  //     time: '2 hours ago',
  //     icon: 'info',
  //     iconClass: 'icon-info',
  //     unread: true,
  //   },
  // ];

  apps = [
    {
      name: 'Chat',
      description: 'Messages & Emails',
      icon: 'chat',
      bgColor: '#818cf8',
    },
    {
      name: 'Todo',
      description: 'Completed task',
      icon: 'check_circle',
      bgColor: '#6ee7b7',
    },
    {
      name: 'Invoice',
      description: 'Get latest invoice',
      icon: 'receipt',
      bgColor: '#93c5fd',
    },
    {
      name: 'Calendar',
      description: 'Get Dates',
      icon: 'calendar_today',
      bgColor: '#fca5a5',
    },
    {
      name: 'Tickets',
      description: 'Create new ticket',
      icon: 'confirmation_number',
      bgColor: '#c4b5fd',
    },
    {
      name: 'Courses',
      description: 'Create new course',
      icon: 'school',
      bgColor: '#fcd34d',
    },
  ];

  applicationsList(): void {
    this.router.navigate(['/applications']);
  }

  handleLogout(): void {
    this.authService.logout();
  }

  rateApplication(item: Home, rating: number) {
    this.ratings.update((currentRatings) => ({
      ...currentRatings,
      [item.title]: rating,
    }));
    console.log(`Rated ${item.title} with ${rating} stars`);
  }
}
