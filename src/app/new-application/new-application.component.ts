import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Home } from '../home/home.model';
import { ApplicationsService } from '../applications.service';

@Component({
  selector: 'app-new-application',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatChipsModule, MatIconModule],
  templateUrl: './new-application.component.html',
  styleUrl: './new-application.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NewApplicationComponent {
  form = new FormGroup({
    applicationName: new FormControl(''),
    applicationCategory: new FormControl(''),
    applicationRedirectLink: new FormControl(''),
    applicationImage: new FormControl(''),
    applicationDescription: new FormControl(''),
    accessibleDepartments: new FormControl<string[]>([]),
  });

  departments: string[] = ['Admin', 'HR', 'Finance', 'IT', 'Marketing', 'Data & AI', 'Application Engineering', 'Digital Assurance'];
  selectedDepartments: string[] = [];

  constructor(public dialogRef: MatDialogRef<NewApplicationComponent>, private applicationsService: ApplicationsService) {}

  onSubmit() {
    const newApplication: Home = {
      image: this.form.value.applicationImage || '',
      title: this.form.value.applicationName || '',
      description: this.form.value.applicationDescription || '',
      link: this.form.value.applicationRedirectLink || '',
      department: this.form.value.accessibleDepartments || []
    };
    this.applicationsService.addApplication(newApplication);
    this.close();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.form.patchValue({
      applicationImage: file
    });
  }

  onDepartmentsChange(event: any): void {
    this.selectedDepartments = event.value;
  }

  removeDepartment(department: string): void {
    const index = this.selectedDepartments.indexOf(department);
    if (index >= 0) {
      this.selectedDepartments.splice(index, 1);
      this.form.controls.accessibleDepartments.setValue(this.selectedDepartments);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
