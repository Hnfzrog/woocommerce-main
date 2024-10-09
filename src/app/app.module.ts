import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'id' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
