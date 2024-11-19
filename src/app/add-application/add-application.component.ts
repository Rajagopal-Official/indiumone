import { Component, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Home } from '../home/home.model';
import { ApplicationsService } from '../applications.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../shared.service'; // Import SharedService

@Component({
  selector: 'app-new-application',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AddApplicationComponent {
  form = new FormGroup({
    applicationName: new FormControl(''),
    applicationCategory: new FormControl(''),
    applicationRedirectLink: new FormControl(''),
    applicationImage: new FormControl(''),
    applicationDescription: new FormControl(''),
    accessibleDepartments: new FormControl<string[]>([]),
    bandComparison: new FormControl(''),
    bandLevel: new FormControl(''),
  });
  errorMessage = signal('');

  departments: string[] = [
    'All',
    'Admin',
    'HR',
    'Finance',
    'IT',
    'Marketing',
    'Data & AI',
    'Application Engineering',
  ];
  selectedDepartments: string[] = [];

  constructor(
    private applicationsService: ApplicationsService,
    private router: Router,
    private httpClient: HttpClient,
    private sharedService: SharedService
  ) {}

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage.set(
        'All fields are required and mandatory to proceed.'
      );
      return;
    }
    const formData = this.form.value;
    const postData = {
      app_name: formData.applicationName,
      app_description: formData.applicationDescription,
      app_group: formData.accessibleDepartments,
    };

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient
      .post(
        'https://indiumssoauth.azurewebsites.net/add_application',
        postData,
        { headers }
      )
      .subscribe(
        (response: any) => {
          console.log('Application added successfully', response);
          this.sharedService.setRecid(response.recid);
          this.router.navigate(['/applications']);
        },
        (error) => {
          console.error('Error Adding Application', error);
        }
      );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.form.patchValue({
      applicationImage: file,
    });
  }

  onDepartmentsChange(event: any): void {
    this.selectedDepartments = event.value;
  }

  removeDepartment(department: string): void {
    const index = this.selectedDepartments.indexOf(department);
    if (index >= 0) {
      this.selectedDepartments.splice(index, 1);
      this.form.controls.accessibleDepartments.setValue(
        this.selectedDepartments
      );
    }
  }
}
