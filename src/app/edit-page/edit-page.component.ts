import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Home } from '../home/home.model';
import { ApplicationsService } from '../applications.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-new-application',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class EditPageComponent implements OnInit {
  form = new FormGroup({
    imageUrl: new FormControl(''),
    demoUrl: new FormControl(''),
    applicationCategory: new FormControl(''),
    documentationUrl: new FormControl(''),
    applicationName: new FormControl({ value: '', disabled: true }),
    applicationDescription: new FormControl({ value: '', disabled: true }),
    accessibleDepartments: new FormControl<string[]>([]),
    accessibleDivisions: new FormControl<string[]>([]),
    bandComparison: new FormControl(''),
    bandLevel: new FormControl(''),
    applicationStatus: new FormControl(true),
  });
  divisions: string[] = [
    'All',
    'App Engineering',
    'Data and AI',
    'Microsoft',
    'Lowcode',
    'Tetsing',
  ];
  selectedDivision: string[] = [];
  departments: string[] = [
    'All',
    'Admin',
    'HR',
    'Finance',
    'IT',
    'Marketing',
    'Data & AI',
    'Application Engineering',
    'Digital Assurance',
  ];
  selectedDepartments: string[] = [];

  constructor(
    private applicationsService: ApplicationsService,
    private router: Router,
    private httpClient: HttpClient,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.fetchApplicationDetails();
  }

  fetchApplicationDetails() {
    const recid = this.sharedService.getRecid();
    if (!recid) {
      console.error('No recid found in SharedService');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const postData = {
      id: recid,
    };

    this.httpClient
      .post(
        'https://indiumssoauth.azurewebsites.net/get_application',
        postData,
        { headers }
      )
      .subscribe(
        (response: any) => {
          console.log('API Response', response);
          console.log(response.data.app_name,'raju')
          this.form.patchValue({
            applicationName: response.data.app_name,
            applicationDescription: response.data.app_description,
            accessibleDepartments: response.data.app_group,
          });
          console.log('Form Values after patchValue:', this.form.value);
        },
        (error) => {
          console.error('Error fetching application details', error);
        }
      );
  }

  onSubmit() {
    if (this.form.invalid) {
      console.error('Form is invalid');
      return;
    }

    const formData = this.form.value;
    const postData = {
      demoUrl: formData.demoUrl,
      documentationUrl: formData.documentationUrl,
      // applicationName: formData.applicationName,
      // applicationDescription: formData.applicationDescription,
      // accessibleDepartments: formData.accessibleDepartments,
      // accessibleDivisions: formData.accessibleDivisions,
      bandLevel: formData.bandLevel,
      applicationStatus: formData.applicationStatus,
    };

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient
      .post('https://indiumssoauth.azurewebsites.net/update-application', postData, { headers })
      .subscribe(
        (response) => {
          console.log('Application updated successfully', response);
        },
        (error) => {
          console.error('Error updating application', error);
        }
      );
  }

  onImageUpload() {
    const imageUrlControl = this.form.get('imageUrl');
    if (imageUrlControl) {
      const imageUrl = imageUrlControl.value;
      if (!imageUrl) {
        console.error('Image URL is required');
        return;
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in local storage');
        return;
      }
  
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      const postData = {
        imageUrl: imageUrl,
      };
  
      this.httpClient
        .post('https://indiumssoauth.azurewebsites.net/upload_image', postData, { headers })
        .subscribe(
          (response) => {
            console.log('Image uploaded successfully', response);
          },
          (error) => {
            console.error('Error uploading image', error);
          }
        );
    } else {
      console.error('Image URL control not found');
    }
  }
  onDepartmentsChange(event: any): void {
    this.selectedDepartments = event.value;
  }

  onDivisionChange(event: any): void {
    this.selectedDivision = event.value;
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

  removeDivision(division: string): void {
    const index = this.selectedDivision.indexOf(division);
    if (index >= 0) {
      this.selectedDivision.splice(index, 1);
      this.form.controls.accessibleDivisions.setValue(this.selectedDivision);
    }
  }

  onStatusChange(event: any): void {
    this.form.controls.applicationStatus.setValue(event.checked);
  }
}
