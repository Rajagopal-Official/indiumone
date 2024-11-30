import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  modifiedby: string;
  n_app_message: string;
  n_app_name: string;
  n_app_url: string;
  read_status: number;
  target_emailid: string;
  updatets: string;
  icon_url:string
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'https://indiumssoauth.azurewebsites.net';

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Notification[]>(`${this.baseUrl}/get_user_notifications`, { headers });
  }

  markAsRead(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/update_user_notifications`, {
      headers,
      params: { id: id.toString() }
    });
  }

  markAllAsRead(ids: number[]): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requests = ids.map(id => 
      this.http.get(`${this.baseUrl}/update_user_notifications`, {
        headers,
        params: { id: id.toString() }
      })
    );
    return new Observable(subscriber => {
      Promise.all(requests.map(req => req.toPromise()))//promise.all is used to handle multiple asynchronous operations simaltaneously
       //wait for all http requests to get complete
      .then(() => {
          subscriber.next();//Notifies success and 
          subscriber.complete();//Notifies Completion
        })
        .catch(error => subscriber.error(error));
    });
  }
}