import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Article } from '../article';
import { ArticleService } from '../article.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {



    form: FormGroup = new FormGroup({
        UserName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
        Password: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    });

    constructor( 
        private articleService: ArticleService,
        private router: Router,
    ) { }

    ngOnInit() {

     }

    Login(): void {
        console.log('A',this.form.get('UserName')?.value);
        console.log('B',this.form.get('Password')?.value);
        this.articleService.getUser(this.form.get('UserName')?.value,this.form.get('Password')?.value).
            subscribe( (user) => {
                console.log(user.StatusCode);
                    alert(user.Message);
                    this.articleService.Login(user.Data);
                    this.router.navigate(['articles']);
            });
     }
}