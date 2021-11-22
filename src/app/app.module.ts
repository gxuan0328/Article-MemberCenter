import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleAddComponent } from './article-add/article-add.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticleSearchComponent } from './article-search/article-search.component';
import { LoginComponent } from './login/login.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import { SignComponent } from './sign/sign.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PermissionGuard } from './guard/permission.guard';
import { GuestGuard } from './guard/guest.guard';
import { AddExitGuard, EditExitGuard } from './guard/confirm.guard';
import { PersonalComponent } from './personal/personal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent,
    ArticleDetailComponent,
    ArticleEditComponent,
    ArticleAddComponent,
    ArticleSearchComponent,
    LoginComponent,
    ToolbarComponent,
    SignComponent,
    PersonalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
    MatTooltipModule,
    MatExpansionModule,
    MatMenuModule,
    FormsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDatepickerModule, 
    MatNativeDateModule, 

  ],
  providers: [
    PermissionGuard,
    GuestGuard,
    AddExitGuard,
    EditExitGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
