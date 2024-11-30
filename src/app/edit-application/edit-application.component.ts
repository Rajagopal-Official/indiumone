import { SharedService } from './../shared.service';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ApplicationsService } from '../applications.service';
import { Home } from '../home/home.model';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from './application.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-edit-application',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NavbarComponent,
  ],
  templateUrl: './edit-application.component.html',
  styleUrl: './edit-application.component.css',
})
export class EditApplicationComponent implements OnInit {
  displayedColumns: string[] = [
    'appName',
    'appDescription',
    'appUrl',
    'status',
    'action',
  ];
  dataSource: Home[] = [];
  filteredDataSource: Home[] = [];
  isLoading = signal<boolean>(true);
  searchTerm = signal<string>('');

  constructor(
    private applicationsService: ApplicationsService,
    private router: Router,
    private httpClient: HttpClient,
    private sharedService: SharedService,
    private applicationService: ApplicationsService
  ) {}

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient
      .get('https://indiumssoauth.azurewebsites.net/get_all_applications', {
        headers,
      })
      .subscribe(
        (response: any) => {
          this.dataSource = response.data.map((app: any) => ({
            id: app.id,
            title: app.app_name,
            description: app.app_description,
            link: app.app_url,
            app_status: app.app_status,
          }));
          this.filteredDataSource = this.dataSource;
          this.isLoading.set(false);

          const titles = this.dataSource.map((app) => app.title);
          this.applicationService.setTitles(titles);
        },
        (error) => {
          console.error('Error fetching applications', error);
          this.isLoading.set(false);
        }
      );
  }
  backToHomePage() {
    this.router.navigate(['/home']);
  }

  editApplication(appId: number) {
    console.log(appId, 'ApplicationsID');
    this.router.navigate(['/edit-app', appId]);
  }

  toggleApplicationModal(): void {
    this.router.navigate(['/add-application']);
  }

  viewApplication(appId: number) {
    this.router.navigate(['/view-application', appId]);
  }

  deleteApplication(appId: string) {
    if (!appId) {
      console.error('No appId provided');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { id: appId };

    this.httpClient
      .post(
        `https://indiumssoauth.azurewebsites.net/delete_application`,
        body,
        { headers }
      )
      .subscribe(
        (response) => {
          console.log('Application deleted successfully', response);
          this.fetchApplications();
        },
        (error) => {
          console.error('Error deleting application', error);
        }
      );
    Swal.fire({
      icon: 'success',
      title: 'Deleted the Application Successfully',
      showConfirmButton: true,
      timer: 1500,
    });
  }

  filterApplications() {
    const term = this.searchTerm().toLowerCase();
    this.filteredDataSource = this.dataSource.filter((app) =>
      app.title.toLowerCase().includes(term)
    );
  }
}
