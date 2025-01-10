import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSectionComponent } from './home/hero-section/hero-section.component';
import { FeaturesComponent } from './home/features/features.component';
import { CommunityComponent } from './home/community/community.component';
import { TestimonialsComponent } from './home/testimonials/testimonials.component';
import { DevelopersComponent } from './home/developers/developers.component';
import { FooterComponent } from './home/footer/footer.component';
import { FooterHeroComponent } from './home/footer-hero/footer-hero.component';
import { FeatureFooterComponent } from './home/features/feature-footer/feature-footer.component';
import { FeatureFooterSectionComponent } from './home/features/feature-footer/feature-footer-section/feature-footer-section.component';
import { TestemoniFooterComponent } from './home/testimonials/testemoni-footer/testemoni-footer.component';
import { TestemonialFooterComponent } from './home/testimonials/testemonial-footer/testemonial-footer.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardUserComponent } from './dashboard/dashboard-user/dashboard-user.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { WebsiteComponent } from './dashboard/website/website.component';
import { PengunjungComponent } from './dashboard/pengunjung/pengunjung.component';
import { TestimoniComponent } from './dashboard/testimoni/testimoni.component';
import { HubungiKamiComponent } from './dashboard/hubungi-kami/hubungi-kami.component';
import { TampilanComponent } from './dashboard/website/tampilan/tampilan.component';
import { PengaturanComponent } from './dashboard/website/pengaturan/pengaturan.component';
import { DataWebsiteComponent } from './dashboard/website/data-website/data-website.component';
import { MempelaiComponent } from './dashboard/website/mempelai/mempelai.component';
import { AcaraComponent } from './dashboard/website/acara/acara.component';
import { GalleryComponent } from './dashboard/website/gallery/gallery.component';
import { CeritaQuoteComponent } from './dashboard/website/cerita-quote/cerita-quote.component';
import { RekeningComponent } from './dashboard/website/rekening/rekening.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RiwayatComponent } from './dashboard/pengunjung/riwayat/riwayat.component';
import { UcapanComponent } from './dashboard/pengunjung/ucapan/ucapan.component';
import { GenerateUndanganComponent } from './generate-undangan/generate-undangan.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { RegisterComponent } from './register/register.component';
import { ToastComponent } from './shared/toast/toast.component';
import { ToastService } from './toast.service';
import { TableComponent } from './shared/table/table.component';
import { ModalComponent } from './shared/modal/modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    HeroSectionComponent,
    FeaturesComponent,
    CommunityComponent,
    TestimonialsComponent,
    DevelopersComponent,
    FooterComponent,
    FooterHeroComponent,
    FeatureFooterComponent,
    FeatureFooterSectionComponent,
    TestemoniFooterComponent,
    TestemonialFooterComponent,
    LoginPageComponent,
    DashboardUserComponent,
    ProfileComponent,
    OverviewComponent,
    SettingsComponent,
    WebsiteComponent,
    PengunjungComponent,
    TestimoniComponent,
    HubungiKamiComponent,
    TampilanComponent,
    PengaturanComponent,
    DataWebsiteComponent,
    MempelaiComponent,
    AcaraComponent,
    GalleryComponent,
    CeritaQuoteComponent,
    RekeningComponent,
    RiwayatComponent,
    UcapanComponent,
    GenerateUndanganComponent,
    RegisterComponent,
    ToastComponent,
    TableComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'id' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, // Provide the AuthInterceptor
      multi: true // Allow multiple interceptors
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
