import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleAddComponent } from './article-add/article-add.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticlesComponent } from './articles/articles.component';
import { AddExitGuard, EditExitGuard } from './guard/confirm.guard';
import { GuestGuard } from './guard/guest.guard';
import { PermissionGuard } from './guard/permission.guard';
import { LoginComponent } from './login/login.component';
import { PersonalComponent } from './personal/personal.component';

import { SignComponent } from './sign/sign.component';

const routes: Routes = [
  { path: '', redirectTo: '/articles', pathMatch: 'full' },
  { path: 'articles', component: ArticlesComponent },
  { path: 'detail/:id', component: ArticleDetailComponent },
  { path: 'detail/:id/edit', component: ArticleEditComponent, canActivate: [PermissionGuard], canDeactivate: [EditExitGuard] },
  { path: 'articles/add', component: ArticleAddComponent, canActivate: [PermissionGuard], canDeactivate: [AddExitGuard] },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'signin', component: SignComponent, canActivate: [GuestGuard] },
  { path: 'personal', component: PersonalComponent, canActivate: [PermissionGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
