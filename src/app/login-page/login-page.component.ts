import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wc-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  isRegistering: boolean = false;

  constructor(
    private router: Router,
    private location: Location
  ){}
  ngOnInit(): void {
    
  }

  toggleRegister() {
    this.isRegistering = !this.isRegistering;
    this.location.back();
  }

  onLogin() {
    // Logika login di sini
    alert('Login berhasil!');
  }

  onRegister() {
    // Logika pendaftaran di sini
    alert('Pendaftaran berhasil!');
  }

}
