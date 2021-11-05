import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ArticleService } from '../article.service';
import { Location } from '@angular/common';
import { User } from '../user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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

    private _form: FormGroup = new FormGroup({
        UserName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
        Password: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    });

    public get form(): FormGroup {
        return this._form;
    }

    private set form(form: FormGroup) {
        this._form = form;
    }

    constructor(
        private articleService: ArticleService,
        private router: Router,
        private jwt: JwtHelperService,
        private location: Location,
    ) { }

    public ngOnInit() {
        this.getUserStatus();
        if(this.status.UserStatus !== 0){
            this.goBack();
        }
    }

    public goBack(): void {
        this.location.back();
      }

    public login(): void {
        this.articleService.userLogin(this.form.get('UserName')?.value, this.form.get('Password')?.value).
            subscribe((user) => {
                alert(user.Message);
                console.log(user.Data);
                this.router.navigate(['articles']);
            });
    }

    private getUserStatus(): void {
        this.articleService.getUserStatus()
          .subscribe(status => {
            this.status = status;
          });
      }
}