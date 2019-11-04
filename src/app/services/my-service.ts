import { Injectable } from '@angular/core';
import {fromEvent, merge, Observable, of, Subject, timer} from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { User } from './user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MyService {

  myNumber$: Subject<number>;

  constructor(private http: HttpClient) {
    this.myNumber$ = new Subject<number>();
    timer(1000, 500)
      .subscribe(() => {
        this.myNumber$.next(Math.floor(Math.random() * 100) + 1);
      });
  }

  getOnlineStatus(): Observable<boolean> {
    return merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false)),
    );
  }

  getNumber(): Observable<number> {
    return this.myNumber$.asObservable();
  }

  searchUsers(keyword: string): Observable<User[]> {
    if (!keyword) {
      return of([]);
    }
    return this.http.get<User[]>(`https://api.github.com/search/users?q=${keyword}`).pipe(map((result: any) => result.items || []));
  }


}
