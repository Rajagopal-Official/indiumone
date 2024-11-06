// grant-access.component.ts
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
import { Question } from './questions.model';

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
    MatIconModule,
  ],
  templateUrl: './grant-access.component.html',
  styleUrls: ['./grant-access.component.css'],
  encapsulation: ViewEncapsulation.None,
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

  questions = signal<Question[]>([
    { text: 'Do you agree to the terms and conditions?', answer: null },
    { text: 'Is the application secure?', answer: null },
    { text: 'Have you reviewed the access request?', answer: null },
    { text: 'Is the resource authorized?', answer: null },
    { text: 'Is the department valid?', answer: null },
    { text: 'Is the email format correct?', answer: null },
    { text: 'Is the name provided?', answer: null },
    { text: 'Is the application active?', answer: null },
    { text: 'Is the department active?', answer: null },
    { text: 'Is the access request valid?', answer: null },
  ]);

  form = new FormGroup({
    departmentAccess: new FormControl<string[]>([]),
    accessMailId: new FormControl(''),
    accessPersonName: new FormControl(''),
  });

  showCommentModal = false;
  showAttachmentModal = false;
  currentComment = '';
  currentQuestionIndex = 0;
  files: File[] = [];

  constructor(private applicationsService: ApplicationsService) {}

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

  answerQuestion(index: number, answer: boolean): void {
    this.questions.update((questions: Question[]) => 
      questions.map((q, i) => 
        i === index ? { ...q, answer } : q
      )
    );
  }

  openCommentModal(index: number): void {
    this.currentQuestionIndex = index;
    this.showCommentModal = true;
  }

  closeCommentModal(): void {
    this.showCommentModal = false;
  }

  saveComment(): void {
    this.questions.update((questions: Question[]) => 
      questions.map((q, i) => 
        i === this.currentQuestionIndex ? { ...q, comment: this.currentComment } : q
      )
    );
    this.closeCommentModal();
  }

  openAttachmentModal(index: number): void {
    this.currentQuestionIndex = index;
    this.showAttachmentModal = true;
  }

  closeAttachmentModal(): void {
    this.showAttachmentModal = false;
  }

  onFileChange(event: any): void {
    this.files = Array.from(event.target.files);
  }

  uploadFiles(): void {
    console.log('Files to upload:', this.files);
    this.closeAttachmentModal();
  }
}