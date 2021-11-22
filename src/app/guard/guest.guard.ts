import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleService } from '../article.service';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  private _status: User = {
    Id: 0,
    UserName: '',
    UserStatus: 0,
    exp: 0,
    iat: 0
  };

  public get status(): User {
    return this._status;
  }

  private set status(status: User) {
    this._status = status;
  }

  constructor(
    private articleService: ArticleService,
    private location: Location,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.articleService.getUserStatus()
      .subscribe((status) => {
        this.status = status;
      });
    if (this.status.UserStatus === 0) {
      return true;
    }
    else {
      this.location.back();
      return false;
    }
  }
  
}
