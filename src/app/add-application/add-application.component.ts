import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Home } from '../home/home.model';
import { ApplicationsService } from '../applications.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../shared.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-new-application',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    CommonModule,
    NavbarComponent,
  ],
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AddApplicationComponent implements OnInit {
  form = new FormGroup({
    applicationName: new FormControl<string>(''),
    applicationCategory: new FormControl(''),
    applicationRedirectLink: new FormControl(''),
    applicationImage: new FormControl(''),
    applicationDescription: new FormControl(''),
    accessibleDepartments: new FormControl<string[]>([]),
    bandComparison: new FormControl(''),
    bandLevel: new FormControl(''),
  });
  errorMessage = signal('');

  departments: string[] = [];
  selectedDepartments: string[] = [];

  constructor(
    private applicationsService: ApplicationsService,
    private router: Router,
    private httpClient: HttpClient,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.fetchDepartments();
  }

  fetchDepartments() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const fetchDepartmentApi =
      'https://indiumssoauth.azurewebsites.net/get_zoho_departments';

    this.httpClient.get<any[]>(fetchDepartmentApi, { headers }).subscribe({
      next: (response) => {
        this.departments = response
          .map((item) => item.department)
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort((a, b) => a.localeCompare(b));
        console.log('department--->', this.departments);
        // this.form.controls['accessibleDepartments'].setValue(
        //   this.departments[0]
        // );
      },
      error: (error) => {
        console.error('Error fetching departments:', error);
      },
    });
  }

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
      // app_group: formData.accessibleDepartments,
    };

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const existingTitles: string[] = this.applicationsService.getTitles();

    if (postData.app_name && existingTitles.includes(postData.app_name)) {
      console.error(
        'Application with this title already exists:',
        postData.app_name
      );
      // alert(
      //   'An application with this title already exists. Please choose a different title.'
      // );
      Swal.fire({
        icon: 'warning',
        text: 'An application with this title already exists. Please choose a different title.',
      });

      return;
    }
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
