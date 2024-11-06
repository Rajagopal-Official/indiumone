import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }
  isSidebarOpen = false;
  notifications = signal<string[]>([
    'Rajagopal from HR has requested access for Greythr App',
    'Nirai from Data Engineering has requested access for Tuzo App',
    'Safrin from UI/UX Team requested access for Trimms Application',
  ]);

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  removeNotification(index: number) {
    this.notifications.update(notifications => notifications.filter((_, i) => i !== index));
  }
}