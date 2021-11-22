import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private _title: string = 'Article-List';

  public get title(): string {
    return this._title;
  }

  private set title(title: string) {
    this._title = title;
  }

  constructor(
    private articleService: ArticleService,
    private jwt: JwtHelperService,
  ) { }

  public ngOnInit() {
    const token = localStorage.getItem('TOKEN')?.toString()!;
    if (Boolean(token) && !this.jwt.isTokenExpired(token)) {
      this.articleService.login(this.jwt.decodeToken(token));
      this.articleService.setAuthorization(token);
    }
  }

}
