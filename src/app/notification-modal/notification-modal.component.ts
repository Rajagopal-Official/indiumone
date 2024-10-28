import { Component, inject, Inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '../notifications.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notifications-dialog',
  templateUrl: './notification-modal.component.html',
  standalone:true,
  imports:[MatIconModule]
})
export class NotificationModalComponent {
  private notificationsService=inject(NotificationsService)
  notifications=signal<string[]>(this.notificationsService.notifications())

  constructor(public dialogRef: MatDialogRef<NotificationModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
