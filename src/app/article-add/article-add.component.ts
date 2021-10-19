import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleService } from '../article.service';
import { Article } from '../article';

@Component({
  selector: 'app-article-add',
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.css']
})
export class ArticleAddComponent implements OnInit {


  constructor(
    private articleService: ArticleService,
    private location: Location,
  ) { }

  public ngOnInit(): void {
  }

  public goBack(): void {
    this.location.back();
  }

  public add(title: string, author: string, textbox: string): void {
    title = title.trim();
    author = author.trim();
    textbox = textbox.trim();
    if (!title || !author || !textbox) {
      console.log('missing something');
      return;
    }
    this.articleService.addArticle({ title: title, author: author, content: textbox } as Article)
      .subscribe(article => {
        console.log(article);
        this.location.back();
      });
  }


}
