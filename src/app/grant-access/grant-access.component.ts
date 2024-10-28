import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApplicationsService } from '../applications.service';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-grant-access',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './grant-access.component.html',
  styleUrls: ['./grant-access.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GrantAccessComponent implements OnInit {
  selectedApplications: string[] = [];
  applicationTitles = signal<string[]>([]);
  selectedDepartments: string[] = [];
  departments: string[] = [
    'Admin',
    'HR',
    'Finance',
    'IT',
    'Marketing',
    'Data & AI',
    'Application Engineering',
    'Digital Assurance',
  ];

  constructor(
    private applicationsService: ApplicationsService,
    public MatDialogRef: MatDialogRef<GrantAccessComponent>
  ) {}
  form = new FormGroup({
    departmentAccess: new FormControl<string[]>([]),
    accessMailId: new FormControl(''),
    accessPersonName: new FormControl(''),
  });

  ngOnInit(): void {
    this.applicationTitles.set(
      this.applicationsService.applications().map((app) => app.title)
    );
  }

  onApplicationsChange(event: any): void {
    this.selectedApplications = event.value;
  }

  onDepartmentsChange(event: any): void {
    this.selectedDepartments = event.value;
  }

  removeApplication(application: string): void {
    const index = this.selectedApplications.indexOf(application);
    if (index >= 0) {
      this.selectedApplications.splice(index, 1);
      this.form.controls.departmentAccess.setValue(this.selectedApplications);
    }
  }

  removeDepartment(department: string): void {
    const index = this.selectedDepartments.indexOf(department);
    if (index >= 0) {
      this.selectedDepartments.splice(index, 1);
      this.form.controls.departmentAccess.setValue(this.selectedDepartments);
    }
  }
  close(): void {
    this.MatDialogRef.close();
  }
}