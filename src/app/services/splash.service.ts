import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SplashService implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const initialEntry = localStorage.getItem('initialEntry') || 'true';
    console.log('initialEntry', initialEntry);
    if (JSON.parse(initialEntry)) {
      this.router.navigate(['splash']);
    } else {
      return true;
    }
  }
}
