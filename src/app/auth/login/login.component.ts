import {Component, HostBinding, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Title} from "@angular/platform-browser";


import {UsersService} from '../../shared/services/users.service';
import {User} from '../../shared/models/user.model';
import {Message} from '../../shared/models/message.model';
import {AuthService} from '../../shared/services/auth.service';
import {fadeStateTrigger} from "../../shared/animation/fade.animation";

@Component({
  selector: 'wfm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeStateTrigger],
})
export class LoginComponent implements OnInit {


  form: FormGroup;
  message: Message;

  constructor(
    private usersServise: UsersService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
  ) {
    title.setTitle('Вход в систему')
  }


  ngOnInit() {
    this.message = new Message('danger', '');

    this.route.queryParams
      .subscribe((params: Params) => {
        if (params[`nowCanLogin`]) {
          this.showMessage({
            text: 'Теперь вы можете зайти в систему',
            type: 'success'
          });
        } else {
          if (params['accessDenied']) {
            this.showMessage({
              text: 'Необходимо войти!',
              type: 'warning'
            });
          }
        }
      });


    this.form = new FormGroup({
      'email': new FormControl('wfm@mail.ru', [Validators.required, Validators.email] ),
      'password': new FormControl('12345678', [Validators.required, Validators.minLength(6)])
    });
  }

  private showMessage(message: Message) {
    this.message = message;

    window.setTimeout(() => {
      this.message.text = '';
    }, 5000);
  }
  onSubmit() {
    const formData = this.form.value;
    this.usersServise.getUserByEmail(formData.email)
      .subscribe((users: User[]) => {
        let user: User = users[0];
        if (user) {
          if (formData.password === user.password) {
            this.message.text = '';
            window.localStorage.setItem('user', JSON.stringify(user));
            this.authService.login();
            this.router.navigate(['/system', 'bill']);
          } else {
            this.showMessage({
              text: 'пароль не верный',
              type: 'danger'
            });
          }
        } else {
          this.showMessage({
            text: 'Нет пльзователя',
            type: 'info'
          });
        }
      });
  }
}
