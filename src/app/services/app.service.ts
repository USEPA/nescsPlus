
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/index';

@Injectable()
export class AppService {

  private currentNavigation = new Subject<string>();

  currentNavigation$ = this.currentNavigation.asObservable();

  setNavigation(value: string) {
    this.currentNavigation.next(value);
  }
}
