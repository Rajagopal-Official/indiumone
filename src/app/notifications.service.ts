  import { Injectable, signal } from '@angular/core';

  @Injectable({
    providedIn: 'root'
  })
  export class NotificationsService {

    constructor() { }
    isSidebarOpen = false;
    notifications = signal<string[]>([
      'Notification 1: Rajagopal has requested access for Greythr App',
      'Notification 2: Nirai has requested access for Tuzo App',
      'Notification 3: Safrin has requested access for Trimms Application',
    ]);
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }

  }
