import { Component, OnInit } from '@angular/core';
import { MyService } from './services/my-service';
import { Observable, Subject } from 'rxjs';
import { User } from './services/user';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {ThemeService} from './services/theme-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'test application';
  private form: FormGroup;
  darkTheme =  new FormControl(false);

  users$: Observable<User[]>;
  loading: boolean;

  constructor(private service: MyService, private formBuilder: FormBuilder, private themeService: ThemeService) {
    this.darkTheme.valueChanges.subscribe(value => {
      if (value) {
        this.themeService.toggleDark();
      } else {
        this.themeService.toggleLight();
      }
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      searchTerm: ''
    });
    this.users$ = this.form.valueChanges
      .pipe(
        tap(() => this.loading = true),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(query => this.service.searchUsers(query.searchTerm)),
        tap(() => this.loading = false)
      );
  }

}
