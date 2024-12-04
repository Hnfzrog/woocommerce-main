import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'wc-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // Variable to store error message

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {}

  onLogin() {
    this.dashboardService.login(this.email, this.password).subscribe(
      response => {
        this.errorMessage = ''; // Clear error message on successful login
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.errorMessage = 'Login failed. Please check your credentials.'; // Set error message on failure
      }
    );
  }
}
