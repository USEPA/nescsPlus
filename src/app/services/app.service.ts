
import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable()
export class AppService {
  public targetRef = new BehaviorSubject('');

  private currentNavigation = new Subject<string>();

  currentNavigation$ = this.currentNavigation.asObservable();

  setNavigation(value: string) {
    this.currentNavigation.next(value);
  }
}
