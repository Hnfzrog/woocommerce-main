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
import { TampilanComponent } from './dashboard/website/tampilan/tampilan.component';
import { PengaturanComponent } from './dashboard/website/pengaturan/pengaturan.component';
import { DataWebsiteComponent } from './dashboard/website/data-website/data-website.component';
import { MempelaiComponent } from './dashboard/website/mempelai/mempelai.component';
import { AcaraComponent } from './dashboard/website/acara/acara.component';
import { GalleryComponent } from './dashboard/website/gallery/gallery.component';
import { CeritaQuoteComponent } from './dashboard/website/cerita-quote/cerita-quote.component';
import { RekeningComponent } from './dashboard/website/rekening/rekening.component';
import { RiwayatComponent } from './dashboard/pengunjung/riwayat/riwayat.component';
import { UcapanComponent } from './dashboard/pengunjung/ucapan/ucapan.component';
import { GenerateUndanganComponent } from './generate-undangan/generate-undangan.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'buat-undangan', component: GenerateUndanganComponent },
  {
    path: 'dashboard',
    component: DashboardUserComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      {
        path: 'website',
        component: WebsiteComponent,
        children: [
          { path: 'tampilan', component: TampilanComponent },
          { path: 'pengaturan', component: PengaturanComponent },
          { path: 'data-website', component: DataWebsiteComponent },
          { path: 'mempelai', component: MempelaiComponent },
          { path: 'acara', component: AcaraComponent },
          { path: 'gallery', component: GalleryComponent },
          { path: 'cerita-quote', component: CeritaQuoteComponent },
          { path: 'rekening', component: RekeningComponent },
        ],
      },
      {
        path: 'pengunjung',
        component: PengunjungComponent,
        children: [
          { path: 'riwayat', component: RiwayatComponent },
          { path: 'ucapan', component: UcapanComponent },
        ],
      },      { path: 'testimoni', component: TestimoniComponent },
      { path: 'hubungi-kami', component: HubungiKamiComponent },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
