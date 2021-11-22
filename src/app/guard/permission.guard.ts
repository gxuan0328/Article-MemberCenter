import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleService } from '../article.service';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

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
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.articleService.getUserStatus()
      .subscribe((status) => {
        this.status = status;
      });
    if (this.status.UserStatus !== 0) {
      return true;
    }
    else {
      this.snackBar.open('未擁有操作權限，請先登入帳號', 'OK', { horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3000 });
      this.router.navigate(['login']);
      return false;
    }
  }
  
}
