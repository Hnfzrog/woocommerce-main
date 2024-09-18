import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  Cssclass: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.Cssclass = false;
  }

  onClick() {
    this.Cssclass = !this.Cssclass;
  }

  // Fungsi untuk menavigasi ke bagian tertentu pada halaman
  navigate(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
