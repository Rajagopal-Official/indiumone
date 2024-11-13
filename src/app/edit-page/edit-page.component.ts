import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApplicationsService } from '../applications.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    documentationUrl: new FormControl(''),
    applicationName: new FormControl({ value: '', disabled: true }),
    applicationDescription: new FormControl({ value: '', disabled: true }),
    accessibleDepartments: new FormControl<string>(''),
    accessibleDivisions: new FormControl<string>(''),
    bandLevel: new FormControl<number | null>(null),
    applicationStatus: new FormControl(true),
    appUrl: new FormControl(''),
    appSecret: new FormControl(''),
    appDevTeam: new FormControl('')
  });
  appId: number | null = null;
  bandLevels = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' }
  ];
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
  selectedFile: File | null = null;
  fileSizeError: boolean = false;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private sharedService: SharedService) {}

  ngOnInit() {
    this.appId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.appId, 'AppID');
    if (this.appId) {
      this.fetchApplicationDetails();
    }
  }

  fetchApplicationDetails() {
    if (!this.appId) {
      console.error('No appId found in route parameters');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const postData = {
      id: this.appId,
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
          this.form.patchValue({
            applicationName: response.data.app_name,
            applicationDescription: response.data.app_description,
            accessibleDepartments: response.data.app_group,
            appUrl: response.data.app_url,
              appSecret: response.data.app_secret,
              appDevTeam: response.data.app_dev_team,
              documentationUrl: response.data.app_documentation_url,
              demoUrl: response.data.app_demo_url,
              bandLevel: response.data.level_access_restriction,
              applicationStatus: response.data.app_status === 1,
              accessibleDivisions: response.data.division_access_restriction,

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
    if (!this.appId) {
      console.error('No appId found in route parameters');
      return;
    }

    const postData = {
      id: this.appId,
      app_status: formData.applicationStatus ? 1 : 0,
      app_url: formData.appUrl,
      division_access_restriction: formData.accessibleDivisions,
      department_access_restriction: formData.accessibleDepartments,
      level_access_restriction: formData.bandLevel,
      app_documentation_url: formData.documentationUrl,
      app_secret: formData.appSecret,
      app_demo_url: formData.demoUrl,
      app_dev_team: formData.appDevTeam
    };

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient
      .post('https://indiumssoauth.azurewebsites.net/update_application', postData, { headers })
      .subscribe(
        (response) => {
          console.log('Application updated successfully', response);
        },
        (error) => {
          console.error('Error updating application', error);
        }
      );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.size > 1048576) { 
      this.fileSizeError = true;
      this.selectedFile = null;
    } else {
      this.fileSizeError = false;
      this.selectedFile = file;
    }
  }

  onImageUpload() {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }
  
    if (!this.appId) {
      console.error('No appId found in route parameters');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }
  
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      const base64Image = reader.result as string;
      const postData = {
        id: this.appId,
        imagefile: base64Image.split(',')[1] 
      };
  
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');
  
      this.httpClient
        .post('https://indiumssoauth.azurewebsites.net/upload_image_base64', postData, { headers })
        .subscribe(
          (response) => {
            console.log('Image uploaded successfully', response);
          },
          (error) => {
            console.error('Error uploading image', error);
          }
        );
    };
    reader.onerror = (error) => {
      console.error('Error reading file', error);
    };
  }

  onDepartmentsChange(event: any): void {
    this.selectedDepartments = event.value;
  }

  onDivisionChange(event: any): void {
    this.selectedDivision = event.value;
  }

  onStatusChange(event: any): void {
    this.form.controls.applicationStatus.setValue(event.checked);
  }
}
