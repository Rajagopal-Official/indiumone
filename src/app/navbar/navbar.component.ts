import { Component, signal, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { NotificationService, Notification } from '../../../src/app/notifications.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatMenuModule,
    MatBadgeModule,
    MatTreeModule,
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  sidenavOpen = signal(true);
  showSearchField = signal<boolean>(false);
  searchTerm = signal<string>('');
  selectedDepartment = signal<string>('All');
  items = signal<any[]>([]);
  filteredItems = signal<any[]>([]);
  isHomePage: boolean = false;
  notifications = signal<Notification[]>([]);
  unreadCount = signal<number>(0);

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isHomePage = this.route.snapshot.routeConfig?.path?.includes('home') || false;
    this.loadNotifications();
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

  usernameSignal = this.authService.getUsernameSignal();
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  getDisplayName(): string {
    const username = this.usernameSignal();
    console.log(username, 'user');
    if (username) {
      const namePart = username.split('@')[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }
    return 'User';
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
  toggleSidenav() {
    this.sidenavOpen.update((value) => !value);
  }
  toggleSearchField() {
    this.showSearchField.set(true);
  }
  searchApps() {
    const searchTerm = this.searchTerm().toLowerCase();
    this.filterApps(this.selectedDepartment(), searchTerm);
  }
  closeMenu() {
    this.menuTrigger.closeMenu();
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
  handleLogout(): void {
    this.authService.logout();
  }

  backToHomePage() {
    this.router.navigate(['/home']);
  }
}