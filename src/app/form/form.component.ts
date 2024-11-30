import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class FormComponent implements OnInit {
  form = new FormGroup({
    roomName: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
  });

  availableStartTimes: string[] = [];
  availableEndTimes: string[] = [];

  ngOnInit() {
    this.generateAvailableStartTimes();

    this.form.get('startTime')?.valueChanges.subscribe((startTime) => {
      if (startTime) {
        this.updateAvailableEndTimes(startTime);
      }
    });
  }
  generateAvailableStartTimes() {
    const times: string[] = [];
    for (let hour = 8; hour <= 20; hour++) {
      const hour12 = hour <= 12 ? hour : hour - 12;
      const ampm = hour < 12 ? 'AM' : 'PM';

      times.push(`${hour.toString().padStart(2, '0')}:00`);

      if (hour !== 20) {
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    this.availableStartTimes = times;
  }

  updateAvailableEndTimes(startTime: string) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDateTime = new Date();
    startDateTime.setHours(hours, minutes, 0, 0);

    const minEndTime = new Date(startDateTime.getTime() + 30 * 60000);

    const times: string[] = [];
    let currentTime = new Date(minEndTime);

    while (currentTime.getHours() <= 20) {
      const hour = currentTime.getHours();
      const minute = currentTime.getMinutes();

      times.push(
        `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`
      );

      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }

    this.availableEndTimes = times;

    const currentEndTime = this.form.get('endTime')?.value;
    if (currentEndTime && !times.includes(currentEndTime)) {
      this.form.patchValue({ endTime: times[0] });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
