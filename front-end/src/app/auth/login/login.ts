import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AutheService } from '../services/authe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(
    private authService: AutheService,
    private router: Router
  ) {}

  loginData = {
    email: '',
    password: ''
  };

  login() {
    this.authService.login(this.loginData.email, this.loginData.password)
      .subscribe({
        next: (response) => {
          console.log(response)
          this.authService.saveToken(response.token);
          this.router.navigate(['']);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}