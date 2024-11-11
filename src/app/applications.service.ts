import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Home } from './home/home.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private apiUrl =
    'https://indiumssoauth.azurewebsites.net/get_authorized_apps';
  applications = signal<Home[]>([]);

  constructor(private http: HttpClient) {}

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  fetchApplications() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      tap((data) => {
        console.log('Fetched data:', data);
        const mappedData = data.map((app) => ({
          image: app.app_image_url,
          title: this.capitalizeFirstLetter(app.app_name),
          description: this.capitalizeFirstLetter(app.app_description),
          link: app.app_url,
          department: app.department_access_restriction,
          app_status: app.app_status,
        }));
        this.applications.set(mappedData);
        console.log('Applications signal after setting:', this.applications());
      })
    );
  }

  addApplication(application: Home) {
    this.applications.update((apps) => [...apps, application]);
  }
}
