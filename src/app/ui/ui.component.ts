import { Component, signal } from '@angular/core';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';
import { AuthService } from '../auth/auth.service';
import { ApplicationsService } from '../applications.service';
import { Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface TreeNode {
  name: string;
  icon?: string;
  children?: TreeNode[];
}

interface Home {
  image: string;
  title: string;
  description: string;
  link: string;
  department: string | string[];
  bandComparison?: string;
  bandLevel?: string;
  app_status: number;
}

@Component({
  selector: 'app-ui',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './ui.component.html',
  styleUrl: './ui.component.css'
})
export class UiComponent {
  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  constructor(
    private authService: AuthService,
    private applicationsService: ApplicationsService,
    private router: Router
  ) {
    this.dataSource.data = [
      {
        name: 'Application Configuration',
        icon: 'apps',
        children: [
          { name: 'Applications', icon: 'web' },
        ]
      }
    ];
  }

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  isLoading = signal<boolean>(true);
  sidenavOpen = signal(true);
  searchTerm = signal<string>('');
  items = signal<Home[]>([]);
  filteredItems = signal<Home[]>([]);
  showSearchField=signal<boolean>(false);

  searchApps() {
    const searchTerm = this.searchTerm().toLowerCase();
    this.filteredItems.set(
      this.items().filter((item) =>
        item.title.toLowerCase().includes(searchTerm)
      )
    );
  }
  
  menuItems = signal([
    { icon: 'chat', text: 'Chat', color: 'color-warning', badge: '5' },
    { icon: 'calendar_today', text: 'Calendar', color: 'color-info' },
    { icon: 'email', text: 'Email', color: 'color-primary', badge: '12' },
    { icon: 'view_kanban', text: 'Kanban', color: 'color-success' },
    { icon: 'contacts', text: 'Contacts', color: 'color-warning' },
    { icon: 'school', text: 'Courses', color: 'color-info' },
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

  toggleSidenav() {
    this.sidenavOpen.update(value => !value);
  }
  toggleSearchField(){
    this.showSearchField.set(true)
  }
  notifications = [
    {
      id: 1,
      text: 'New project invitation received',
      time: '5 mins ago',
      icon: 'folder_shared',
      iconClass: 'icon-info',
      unread: true
    },
    {
      id: 2,
      text: 'Successfully deployed project',
      time: '2 hours ago',
      icon: 'check_circle',
      iconClass: 'icon-success',
      unread: true
    },
    {
      id: 3,
      text: 'Server warning: High CPU usage',
      time: '1 day ago',
      icon: 'warning',
      iconClass: 'icon-warning',
      unread: false
    }
  ];
  apps = [
    {
      name: 'Chat',
      description: 'Messages & Emails',
      icon: 'chat',
      bgColor: '#818cf8'
    },
    {
      name: 'Todo',
      description: 'Completed task',
      icon: 'check_circle',
      bgColor: '#6ee7b7'
    },
    {
      name: 'Invoice',
      description: 'Get latest invoice',
      icon: 'receipt',
      bgColor: '#93c5fd'
    },
    {
      name: 'Calendar',
      description: 'Get Dates',
      icon: 'calendar_today',
      bgColor: '#fca5a5'
    },
    {
      name: 'Tickets',
      description: 'Create new ticket',
      icon: 'confirmation_number',
      bgColor: '#c4b5fd'
    },
    {
      name: 'Courses',
      description: 'Create new course',
      icon: 'school',
      bgColor: '#fcd34d'
    }
  ];
  applicationsList(): void {
    this.router.navigate(['/applications']);
  }
  logout(): void {
    this.authService.logout();
  }
}

