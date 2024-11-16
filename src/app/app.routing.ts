import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardUserComponent } from './dashboard/dashboard-user/dashboard-user.component';
const routes: Routes = [
  {
     path: '', 
     component: HomeComponent 
    },
  {
     path: 'login', 
     component: LoginPageComponent 
    },
  {
     path: 'dashboard', 
     component: DashboardUserComponent 
    },
  
];

export const AppRouting = RouterModule.forChild(routes);
