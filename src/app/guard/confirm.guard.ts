import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticleAddComponent } from '../article-add/article-add.component';
import { ArticleEditComponent } from '../article-edit/article-edit.component';

@Injectable({
  providedIn: 'root'
})
export class AddExitGuard implements CanDeactivate<ArticleAddComponent> {
  canDeactivate(
    component: ArticleAddComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.submit){
      return true;
    }
    else{
      return confirm('離開此頁面，將遺失目前編輯進度');
    }
      
  }
}


export class EditExitGuard implements CanDeactivate<ArticleEditComponent> {
  canDeactivate(
    component: ArticleEditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.submit) {
      return true;
    }
    else {
      return confirm('離開此頁面，將遺失目前編輯進度');
    }

  }
}