import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

import {UsersService} from "../../shared/services/users.service";
import {User} from "../../shared/models/user.model";




@Component({
  selector: 'wfm-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup;
  private route: ActivatedRoute;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private title: Title,
    ) {
    title.setTitle('Регистрация')
  }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl('q@w.e', [Validators.required, Validators.email ], [this.forbiddenEmails.bind(this)]),
      'password': new FormControl('qwqwqw',[Validators.required, Validators.minLength(6)]),
      'name': new FormControl('qwqwqw',[Validators.required]),
      'agree': new FormControl(true,[Validators.requiredTrue])
    });
    console.log(this.form);
  }

  onSubmit() {
    const {email, password, name} = this.form.value;
    const user = new User(email, password, name);
    this.usersService.createNewUser(user).
      subscribe(() => {
      this.router.navigate(['/login'], {
        queryParams: {
          nowCanLogin: true
          }
        });
      });
  }

  forbiddenEmails(control: FormControl): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.usersService.getUserByEmail(control.value)
        .subscribe((users: User[]) => {
          if (users[0]) {
            console.log('if');
            resolve({forbiddenEmail: true});
          } else {
            resolve(null);
          }
        });
    } );
  }

}
