import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardUserComponent } from './dashboard/dashboard-user/dashboard-user.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { HubungiKamiComponent } from './dashboard/hubungi-kami/hubungi-kami.component';
import { PengunjungComponent } from './dashboard/pengunjung/pengunjung.component';
import { TestimoniComponent } from './dashboard/testimoni/testimoni.component';
import { WebsiteComponent } from './dashboard/website/website.component';

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
    component: DashboardUserComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'website', component: WebsiteComponent },
      { path: 'pengunjung', component: PengunjungComponent },
      { path: 'testimoni', component: TestimoniComponent },
      { path: 'hubungi-kami', component: HubungiKamiComponent },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes) // Use forRoot for main routing module
  ],
  exports: [RouterModule] // Export RouterModule to make it available in other modules
})
export class AppRoutingModule {}
