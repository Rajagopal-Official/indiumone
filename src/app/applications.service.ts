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
  private applicationTitles: string[] = [];

  setTitles(titles: string[]) {
    this.applicationTitles = titles;
  }

  getTitles(): string[] {
    return this.applicationTitles;
  }

  constructor(private http: HttpClient) {}

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private formatUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  }

  fetchApplications() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      tap((data) => {
        const mappedData = data.map((app) => ({
          image: app.app_image_url,
          title: this.capitalizeFirstLetter(app.app_name),
          description: this.capitalizeFirstLetter(app.app_description),
          link: this.formatUrl(app.app_url),
          department: app.department_access_restriction,
          app_status: app.app_status,
          devTeam: app.app_dev_team,
          demoUrl: this.formatUrl(app.app_demo_url),
        }));
        this.applications.set(mappedData);
      })
    );
  }

  addApplication(application: Home) {
    this.applications.update((apps) => [...apps, application]);
  }
}
