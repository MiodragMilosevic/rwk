import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../../services/storage-service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuardService implements CanActivate {

  constructor(
    private router: Router,
    private _StorageService: StorageService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const token = this._StorageService.getToken();
    const user = this._StorageService.getCurrentUser();
    if (token) {
      this.router.navigateByUrl('/profile');
      return false;
    } else {
      return true;
    }
  }
}
