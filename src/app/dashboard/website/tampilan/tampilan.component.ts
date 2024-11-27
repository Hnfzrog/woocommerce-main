import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wc-tampilan',
  templateUrl: './tampilan.component.html',
  styleUrls: ['./tampilan.component.scss']
})
export class TampilanComponent implements OnInit {

  cards = [
    { label: 'Scroll', title: 'Modern', image: 'assets/modern.svg', isActive: true },
    { label: 'Slide', title: 'Blue', image: 'assets/modern.svg', isActive: false },
    { label: 'Mobile', title: 'Minimalist', image: 'assets/modern.svg', isActive: false },
    { label: 'Scroll', title: 'Pinky', image: 'assets/modern.svg', isActive: false },
    { label: 'Mobile', title: 'Elegant', image: 'assets/modern.svg', isActive: false },
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
