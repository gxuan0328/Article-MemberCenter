import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleService } from '../article.service';
import { User } from '../user';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  public status: User = {
    ID: 0,
    UserName: 'Guset',
    UserStatus: 0
  };



  // flag: boolean =false;
  // userID: number = 0;
  // userName: string = 'Guset';


  constructor(private articleService: ArticleService) { }

  public ngOnInit(): void {
    this.getUserStatus();
  }

  private getUserStatus(): void {
    let status = this.articleService.getUserStatus();
    console.log(status);
    this.status = status;
  }

  // private getUserStatus(): void {
  //   this.articleService.TEST()
  //     .subscribe(status => {
  //       console.log(status);
  //       this.status= status;
  //     });

  // }

  public Logout(): void {
    if(confirm('Are you sure to logout?')){
      this.articleService.Logout();
      this.getUserStatus();
    }
  }

}
