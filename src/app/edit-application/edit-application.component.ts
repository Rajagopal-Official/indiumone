import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ApplicationsService } from '../applications.service';
import { Home } from '../home/home.model';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-edit-application',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule,MatIconModule, MatProgressSpinnerModule,
  ],
  templateUrl: './edit-application.component.html',
  styleUrl: './edit-application.component.css'
})
export class EditApplicationComponent implements OnInit {
  displayedColumns: string[] = ['appName', 'appDescription', 'appUrl', 'status', 'action'];
  dataSource: Home[] = [];
  isLoading = signal<boolean>(true);


  constructor(private applicationsService: ApplicationsService,private router:Router) {}

  ngOnInit(): void {
    this.applicationsService.fetchApplications().subscribe((data) => {
      this.dataSource = this.applicationsService.applications();
      this.isLoading.set(false)
    });
  }

  editApplication() {
    this.router.navigate(['/edit-app']);
  }
  toggleApplicationModal(): void {
    this.router.navigate(['/add-application']);
  }

  viewApplication() {
    this.router.navigate(['/view-application']);
  }
}
