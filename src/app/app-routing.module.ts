import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes) // Use forRoot for main routing module
  ],
  exports: [RouterModule] // Export RouterModule to make it available in other modules
})
export class AppRoutingModule {}
