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

  onClick(): void {
    // Toggle the Cssclass property to show/hide mobile menu
    this.Cssclass = !this.Cssclass;
  }

  // Function to navigate to a specific section on the page and hide the navbar
  navigate(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.Cssclass = false; // Hide the mobile menu after navigating
  }
}
