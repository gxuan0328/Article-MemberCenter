import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  flag: boolean =false;
  userID: number = 0;
  userName: string = 'Guset';

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    this.getUserStatus();
  }

  private getUserStatus(): void {
    let status = this.articleService.userStatus();
    console.log(status);
    this.flag = status.flag;
    this.userID = status.userID;
    this.userName = status.userName;
  }

  public Logout(): void {
    if(confirm('Are you sure to logout?')){
      this.articleService.Logout();
      this.getUserStatus();
    }
  }

}
