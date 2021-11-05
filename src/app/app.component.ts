import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Article-List';
  constructor(
    private articleService: ArticleService,
    private jwt: JwtHelperService,
  ) { }

  public ngOnInit() {
    let token = localStorage.getItem('TOKEN')?.toString();
    if (Boolean(token) && !this.jwt.isTokenExpired(token)) {
      console.log(this.jwt.isTokenExpired(token));
      console.log(Boolean(token));
      this.articleService.login(this.jwt.decodeToken(token));
    }
    console.log('is token exist? ', Boolean(token) ? 'yes' : 'no');
    console.log('is token expired? ', this.jwt.isTokenExpired(token) ? 'yes' : 'no');

  }

}
