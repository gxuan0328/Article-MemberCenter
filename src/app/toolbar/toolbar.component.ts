import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../article.service';
import { User } from '../user';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  private _status: User = {
    ID: 0,
    UserName: 'Guset',
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
    ) { }

  public ngOnInit(): void {
    this.getUserStatus();
  }

  private getUserStatus(): void {
    this.articleService.getUserStatus()
      .subscribe(status => {
        this.status = status;
      });
  }

  public logout(): void {
    if (confirm('Are you sure to logout?')) {
      this.articleService.logout();
      this.getUserStatus();
      this.router.navigate(['articles']);
    }
  }
}
