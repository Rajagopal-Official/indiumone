import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private recidSubject = new BehaviorSubject<string | null>(null);
  recid$ = this.recidSubject.asObservable();

  setRecid(recid: string) {
    this.recidSubject.next(recid);
  }

  getRecid() {
    return this.recidSubject.value;
  }
}