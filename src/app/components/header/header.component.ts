import { Component, OnInit } from '@angular/core';
import { MyService } from '../../services/my-service';
import { Observable, timer } from 'rxjs';
import {switchMap, takeWhile, tap} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isUserLoggedIn$: Observable<boolean>;
  value$: Observable<number>;
  constructor(private service: MyService) { }

  ngOnInit() {
    this.isUserLoggedIn$  = timer(1000, 5000).pipe(
      switchMap(() => this.service.getOnlineStatus()),
      // stop continuous polling when offline
      takeWhile(status => status !== false)
    );

    this.value$ = timer(1000, 2000)
      .pipe(switchMap(() => this.service.getNumber()));
  }

}
