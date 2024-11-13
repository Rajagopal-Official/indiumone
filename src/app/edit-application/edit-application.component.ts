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

@Component({
  selector: 'app-edit-application',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './edit-application.component.html',
  styleUrl: './edit-application.component.css'
})
export class EditApplicationComponent implements OnInit {
  displayedColumns: string[] = ['appName', 'appDescription', 'appUrl', 'status', 'action'];
  dataSource: Home[] = [];
  isLoading = signal<boolean>(true);

  constructor(private applicationsService: ApplicationsService, private router: Router, private httpClient: HttpClient,private sharedService:SharedService) {}

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications() {
    const recid = this.sharedService.getRecid();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient.get('https://indiumssoauth.azurewebsites.net/get_all_applications', { headers }).subscribe(
      (response: any) => {
        this.dataSource = response.data.map((app: any) => ({
          id:app.id,
          title: app.app_name,
          description: app.app_description,
          link: app.app_url,
          app_status: app.app_status
        }));
        this.isLoading.set(false);
      },
      (error) => {
        console.error('Error fetching applications', error);
        this.isLoading.set(false);
      }
    );
  }

  editApplication(appId:number) {
    console.log(appId,'ApplicationsID')
    this.router.navigate(['/edit-app',appId]);
  }

  toggleApplicationModal(): void {
    this.router.navigate(['/add-application']);
  }

  viewApplication(appId:number) {
    this.router.navigate(['/view-application',appId]);
  }
  deleteApplication(){

  }
}