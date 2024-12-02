import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import Swal from 'sweetalert2';

function urlValidator(control: FormControl): { [key: string]: any } | null {
  const urlPattern = /^(http|https):\/\/[^\s$.?#].[^\s]*$/;
  return urlPattern.test(control.value) ? null : { invalidUrl: true };
}

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
    CommonModule,
    NavbarComponent,
  ],
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EditPageComponent implements OnInit, OnDestroy {
  isSaveEnabled = false;
  form = new FormGroup({
    imageUrl: new FormControl(''),
    demoUrl: new FormControl('', [Validators.required, urlValidator]),
    documentationUrl: new FormControl('', [Validators.required, urlValidator]),
    applicationName: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    applicationDescription: new FormControl('', Validators.required),
    accessibleDepartments: new FormControl<string[]>([]), // Initialize as array
    accessibleDivisions: new FormControl<string[]>([]), // Initialize as array
    bandLevel: new FormControl<string>('', Validators.required),
    applicationStatus: new FormControl(true),
    appUrl: new FormControl('', [Validators.required, urlValidator]),
    appSecret: new FormControl('', Validators.required),
    appDevTeam: new FormControl('', Validators.required),
  });

  appId: number | null = null;
  divisions: string[] = [];
  selectedDivision: string[] = [];
  departments: string[] = [];
  selectedDepartments: string[] = [];
  divisionToDepartments: Record<string, string[]> = {};
  selectedFile: File | null = null;
  fileSizeError: boolean = false;
  imagePreviewUrl: string | null = null;
  isEditMode: boolean = false;
  private routeParamsSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params) => {
      this.appId = Number(params['id']);
      console.log(this.appId, 'AppID');
      this.isEditMode =
        this.route.snapshot.routeConfig?.path?.includes('edit-app') || false;

      if (!this.isEditMode) {
        this.form.disable();
      }
      if (this.appId) {
        this.fetchDepartmentsAndDivisions().then(() => {
          this.fetchApplicationDetails();
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
  }

  fetchDepartmentsAndDivisions(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const apiUrl =
        'https://indiumssoauth.azurewebsites.net/get_zoho_departments';

      this.httpClient.get<any[]>(apiUrl, { headers }).subscribe({
        next: (response) => {
          // Build the division-to-departments mapping
          this.divisionToDepartments = response.reduce((acc, item) => {
            acc[item.division] = acc[item.division] || [];
            acc[item.division].push(item.department);
            return acc;
          }, {} as Record<string, string[]>);

          // Extract and sort unique divisions
          this.divisions = Object.keys(this.divisionToDepartments).sort();
          resolve();
        },
        error: (error) => {
          console.error('Error fetching departments and divisions:', error);
          reject(error);
        },
      });
    });
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

          // Update imagePreviewUrl with the latest image URL from the response and append a timestamp
          this.imagePreviewUrl =
            response.data.app_image_url + '?' + new Date().getTime();

          // Reset isSaveEnabled after successful image upload and preview update
          this.isSaveEnabled = false;

          this.form.patchValue({
            applicationName: response.data.app_name,
            applicationDescription: response.data.app_description,
            accessibleDepartments: response.data.app_group
              ? response.data.app_group.split(',')
              : [],
            appUrl: response.data.app_url,
            imageUrl: response.data.app_image_url,
            appSecret: response.data.app_secret,
            appDevTeam: response.data.app_dev_team,
            documentationUrl: response.data.app_documentation_url,
            demoUrl: response.data.app_demo_url,
            bandLevel: response.data.level_access_restriction.toString(),
            applicationStatus: response.data.app_status === 1,
            accessibleDivisions: response.data.division_access_restriction
              ? response.data.division_access_restriction.split(',')
              : [],
          });
          console.log('Form Values after patchValue:', this.form.value);

          // Update selected divisions and departments based on the fetched data
          this.selectedDivision = response.data.division_access_restriction
            ? response.data.division_access_restriction.split(',')
            : [];
          this.selectedDepartments = response.data.app_group
            ? response.data.app_group.split(',')
            : [];
          this.updateDepartments();
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
      division_access_restriction: (formData.accessibleDivisions ?? []).join(
        ','
      ), // Convert to string
      department_access_restriction: (
        formData.accessibleDepartments ?? []
      ).join(','), // Convert to string
      level_access_restriction: formData.bandLevel,
      app_documentation_url: formData.documentationUrl,
      app_secret: formData.appSecret,
      app_demo_url: formData.demoUrl,
      app_dev_team: formData.appDevTeam,
      app_description: formData.applicationDescription,
    };

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in local storage');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.httpClient
      .post(
        'https://indiumssoauth.azurewebsites.net/update_application',
        postData,
        { headers }
      )
      .subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Application Updated Successfully',
            showConfirmButton: true,
            timer: 1500,
          });
          this.router.navigate(['/applications']);
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
    } else if (file) {
      this.fileSizeError = false;
      this.selectedFile = file;
      this.isSaveEnabled = true;
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
        imagefile: base64Image.split(',')[1],
      };

      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');

      this.httpClient
        .post<{ recid: number; success: string }>(
          'https://indiumssoauth.azurewebsites.net/upload_image_base64',
          postData,
          { headers }
        )
        .subscribe(
          (response) => {
            console.log('Image uploaded successfully', response);

            // After successful upload, fetch the updated application details
            this.fetchApplicationDetails();

            Swal.fire({
              icon: 'success',
              title: 'Image Uploaded Successfully',
              showConfirmButton: true,
              timer: 1500,
            });
          },
          (error) => {
            console.error('Error uploading image', error);
            Swal.fire({
              icon: 'error',
              title: 'Error Uploading Image',
              text: 'Please try again.',
              showConfirmButton: true,
            });
          }
        );
    };
    reader.onerror = (error) => {
      console.error('Error reading file', error);
    };
  }

  onDepartmentsChange(event: any): void {
    this.selectedDepartments = event.value;
    this.form.controls.accessibleDepartments.setValue(this.selectedDepartments);
  }

  onDivisionChange(event: any): void {
    this.selectedDivision = event.value;
    console.log('Selected Divisions:', this.selectedDivision);
    this.updateDepartments();
  }

  updateDepartments(): void {
    this.departments = this.selectedDivision.flatMap(
      (division: string) => this.divisionToDepartments[division] || []
    );
    console.log('Updated Departments:', this.departments);
    this.form.controls.accessibleDepartments.setValue(this.selectedDepartments);
  }

  onStatusChange(event: any): void {
    if (event.checked && this.form.invalid) {
      Swal.fire({
        icon: 'warning',
        title:
          'Please fill all mandatory fields before activating the application.',
        showConfirmButton: true,
      });
      this.form.controls.applicationStatus.setValue(false);
    } else {
      this.form.controls.applicationStatus.setValue(event.checked);
    }
  }
}
